<template>
  <div class="compra-page">
    <div class="navbar">
      <div class="logo" @click="$router.push('/productos')">
        <img src="https://cdn-icons-png.flaticon.com/512/628/628283.png" alt="Logo">
      </div>
      <button class="btn-volver" @click="volver">
        ← Volver
      </button>
    </div>

    <div class="contenido">
      <div class="progreso-compra">
        <div class="paso" :class="{ activo: paso >= 1, completado: paso > 1 }">
          <div class="circulo">
            <span v-if="paso > 1">✓</span>
            <span v-else>1</span>
          </div>
          <span class="texto">Detalles</span>
        </div>
        <div class="linea" :class="{ activo: paso >= 2 }"></div>
        <div class="paso" :class="{ activo: paso >= 2, completado: paso > 2 }">
          <div class="circulo">
            <span v-if="paso > 2">✓</span>
            <span v-else>2</span>
          </div>
          <span class="texto">Entrega</span>
        </div>
        <div class="linea" :class="{ activo: paso >= 3 }"></div>
        <div class="paso" :class="{ activo: paso >= 3, completado: paso > 3 }">
          <div class="circulo">
            <span v-if="paso > 3">✓</span>
            <span v-else>3</span>
          </div>
          <span class="texto">Confirmación</span>
        </div>
      </div>

      <div class="contenedor-compra">
        <!-- Paso 1: Detalles del Producto -->
        <div v-if="paso === 1" class="paso-contenido">
          <h2>Detalles de tu Pedido</h2>
          
          <div class="producto-seleccionado">
            <div class="producto-imagen-grande">
              <img :src="producto.imagen" :alt="producto.nombre">
            </div>
            
            <div class="producto-datos">
              <h3>{{ producto.nombre }}</h3>
              <p class="descripcion">{{ producto.descripcion }}</p>
              
              <div class="agricultor-card">
                <img :src="producto.agricultorImagen" alt="Agricultor" class="agricultor-foto">
                <div class="agricultor-info">
                  <strong>{{ producto.agricultorNombre }}</strong>
                  <div class="rating">
                    <span>{{ producto.rating }}</span>
                    <span>⭐</span>
                  </div>
                </div>
              </div>

              <div class="precio-unitario">
                <span class="label">Precio por Kg:</span>
                <span class="valor">S/ {{ producto.precio }}</span>
              </div>

              <div class="stock-disponible">
                <span class="label">Stock disponible:</span>
                <span class="valor">{{ producto.stock }} Kg</span>
              </div>

              <div class="selector-cantidad">
                <label>Cantidad a comprar (Kg):</label>
                <div class="cantidad-controles">
                  <button @click="disminuirCantidad" :disabled="pedido.cantidad <= 1">-</button>
                  <input 
                    type="number" 
                    v-model.number="pedido.cantidad" 
                    min="1" 
                    :max="producto.stock"
                    @input="validarCantidad"
                  >
                  <button @click="aumentarCantidad" :disabled="pedido.cantidad >= producto.stock">+</button>
                </div>
              </div>

              <div class="total-parcial">
                <span>Subtotal:</span>
                <span class="monto">S/ {{ subtotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button class="btn-siguiente" @click="siguientePaso">
            Continuar →
          </button>
        </div>

        <!-- Paso 2: Información de Entrega -->
        <div v-if="paso === 2" class="paso-contenido">
          <h2>Información de Entrega</h2>

          <div class="formulario-entrega">
            <div class="campo">
              <label>Nombre Completo *</label>
              <input 
                type="text" 
                v-model="pedido.nombreCompleto" 
                placeholder="Juan Pérez García"
                class="input-form"
              >
            </div>

            <div class="campos-fila">
              <div class="campo">
                <label>Email *</label>
                <input 
                  type="email" 
                  v-model="pedido.email" 
                  placeholder="tu@email.com"
                  class="input-form"
                >
              </div>

              <div class="campo">
                <label>Teléfono *</label>
                <input 
                  type="tel" 
                  v-model="pedido.telefono" 
                  placeholder="+51 999 888 777"
                  class="input-form"
                >
              </div>
            </div>

            <div class="campo">
              <label>Dirección Completa *</label>
              <textarea 
                v-model="pedido.direccion" 
                placeholder="Calle, número, distrito, referencias..."
                class="textarea-form"
                rows="3"
              ></textarea>
            </div>

            <div class="campos-fila">
              <div class="campo">
                <label>Distrito *</label>
                <input 
                  type="text" 
                  v-model="pedido.distrito" 
                  placeholder="Miraflores"
                  class="input-form"
                >
              </div>

              <div class="campo">
                <label>Ciudad *</label>
                <input 
                  type="text" 
                  v-model="pedido.ciudad" 
                  placeholder="Lima"
                  class="input-form"
                >
              </div>
            </div>

            <div class="campo">
              <label>Notas adicionales (opcional)</label>
              <textarea 
                v-model="pedido.notas" 
                placeholder="Instrucciones especiales de entrega..."
                class="textarea-form"
                rows="2"
              ></textarea>
            </div>
          </div>

          <div class="botones-navegacion">
            <button class="btn-anterior" @click="anteriorPaso">
              ← Atrás
            </button>
            <button class="btn-siguiente" @click="siguientePaso">
              Continuar →
            </button>
          </div>
        </div>

        <!-- Paso 3: Confirmación -->
        <div v-if="paso === 3" class="paso-contenido">
          <h2>Confirma tu Pedido</h2>

          <div class="resumen-compra">
            <div class="seccion-resumen">
              <h3>Producto</h3>
              <div class="producto-resumen">
                <img :src="producto.imagen" :alt="producto.nombre">
                <div>
                  <strong>{{ producto.nombre }}</strong>
                  <p>{{ pedido.cantidad }} Kg × S/ {{ producto.precio }}</p>
                </div>
              </div>
            </div>

            <div class="seccion-resumen">
              <h3>Datos de Entrega</h3>
              <div class="datos-entrega">
                <p><strong>Nombre:</strong> {{ pedido.nombreCompleto }}</p>
                <p><strong>Email:</strong> {{ pedido.email }}</p>
                <p><strong>Teléfono:</strong> {{ pedido.telefono }}</p>
                <p><strong>Dirección:</strong> {{ pedido.direccion }}</p>
                <p><strong>Distrito:</strong> {{ pedido.distrito }}, {{ pedido.ciudad }}</p>
                <p v-if="pedido.notas"><strong>Notas:</strong> {{ pedido.notas }}</p>
              </div>
            </div>

            <div class="seccion-resumen total-section">
              <h3>Resumen de Pago</h3>
              <div class="desglose-pago">
                <div class="linea-pago">
                  <span>Subtotal:</span>
                  <span>S/ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="linea-pago">
                  <span>Envío:</span>
                  <span>{{ costoEnvio === 0 ? 'Gratis' : 'S/ ' + costoEnvio.toFixed(2) }}</span>
                </div>
                <div class="linea-pago total">
                  <span>Total a Pagar:</span>
                  <span>S/ {{ totalFinal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="metodo-pago">
            <h3>Método de Pago</h3>
            <div class="opciones-pago">
              <label class="opcion-pago" :class="{ seleccionada: pedido.metodoPago === 'efectivo' }">
                <input type="radio" value="efectivo" v-model="pedido.metodoPago">
                <div class="contenido-opcion">
                  <span class="icono">💵</span>
                  <div>
                    <strong>Efectivo</strong>
                    <p>Pago contra entrega</p>
                  </div>
                </div>
              </label>

              <label class="opcion-pago" :class="{ seleccionada: pedido.metodoPago === 'transferencia' }">
                <input type="radio" value="transferencia" v-model="pedido.metodoPago">
                <div class="contenido-opcion">
                  <span class="icono">🏦</span>
                  <div>
                    <strong>Transferencia</strong>
                    <p>Banco de la Nación</p>
                  </div>
                </div>
              </label>

              <label class="opcion-pago" :class="{ seleccionada: pedido.metodoPago === 'yape' }">
                <input type="radio" value="yape" v-model="pedido.metodoPago">
                <div class="contenido-opcion">
                  <span class="icono">📱</span>
                  <div>
                    <strong>Yape / Plin</strong>
                    <p>Pago por billetera móvil</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="botones-navegacion">
            <button class="btn-anterior" @click="anteriorPaso">
              ← Atrás
            </button>
            <button class="btn-confirmar" @click="confirmarPedido">
              Confirmar Pedido ✓
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación Exitosa -->
    <transition name="fade">
      <div v-if="mostrarExito" class="modal-exito" @click="cerrarModal">
        <div class="contenido-exito" @click.stop>
          <div class="icono-exito">✓</div>
          <h2>¡Pedido Confirmado!</h2>
          <p>Tu pedido ha sido enviado al agricultor y está esperando confirmación.</p>
          <div class="info-pedido">
            <p><strong>Número de pedido:</strong> #{{ numeroPedido }}</p>
            <p><strong>Total:</strong> S/ {{ totalFinal.toFixed(2) }}</p>
          </div>
          <p class="mensaje-final">Recibirás una notificación cuando el agricultor confirme tu pedido.</p>
          <button class="btn-cerrar-modal" @click="irAMisPedidos">
            Ver Mis Pedidos
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CompraPage',
  data() {
    return {
      paso: 1,
      mostrarExito: false,
      numeroPedido: '',
      
      // Producto de ejemplo - en la práctica vendría del router o de una API
      producto: {
        id: 1,
        nombre: 'Mangos dulces',
        descripcion: 'Mangos frescos y jugosos, perfectos para disfrutar frescos o en postres',
        imagen: require('@/images/mango.jpg'),
        precio: 7.0,
        stock: 20,
        rating: 4.8,
        agricultorId: 1,
        agricultorNombre: 'Luis Mendoza',
        agricultorImagen: require('@/images/fotouser.jpg')
      },

      pedido: {
        cantidad: 1,
        nombreCompleto: '',
        email: '',
        telefono: '',
        direccion: '',
        distrito: '',
        ciudad: '',
        notas: '',
        metodoPago: 'efectivo'
      },

      costoEnvio: 0 // Envío gratis por ahora
    }
  },

  computed: {
    subtotal() {
      return this.producto.precio * this.pedido.cantidad;
    },

    totalFinal() {
      return this.subtotal + this.costoEnvio;
    }
  },

  methods: {
    aumentarCantidad() {
      if (this.pedido.cantidad < this.producto.stock) {
        this.pedido.cantidad++;
      }
    },

    disminuirCantidad() {
      if (this.pedido.cantidad > 1) {
        this.pedido.cantidad--;
      }
    },

    validarCantidad() {
      if (this.pedido.cantidad < 1) {
        this.pedido.cantidad = 1;
      } else if (this.pedido.cantidad > this.producto.stock) {
        this.pedido.cantidad = this.producto.stock;
      }
    },

    siguientePaso() {
      if (this.paso === 1) {
        this.paso = 2;
      } else if (this.paso === 2) {
        if (this.validarDatosEntrega()) {
          this.paso = 3;
        }
      }
    },

    anteriorPaso() {
      if (this.paso > 1) {
        this.paso--;
      }
    },

    validarDatosEntrega() {
      if (!this.pedido.nombreCompleto || !this.pedido.email || 
          !this.pedido.telefono || !this.pedido.direccion || 
          !this.pedido.distrito || !this.pedido.ciudad) {
        alert('Por favor completa todos los campos obligatorios (*)');
        return false;
      }
      return true;
    },

    confirmarPedido() {
      // Generar número de pedido
      this.numeroPedido = 'PED' + Date.now();
      
      // Simular envío del pedido
      console.log('Pedido confirmado:', {
        producto: this.producto,
        pedido: this.pedido,
        subtotal: this.subtotal,
        total: this.totalFinal
      });

      // Mostrar modal de éxito
      this.mostrarExito = true;
    },

    cerrarModal() {
      this.mostrarExito = false;
      this.$router.push('/productos');
    },

    irAMisPedidos() {
      this.mostrarExito = false;
      this.$router.push('/perfil-comprador');
    },

    volver() {
      this.$router.push('/productos');
    }
  },

  mounted() {
    // Si viene de un producto específico, cargar sus datos
    // En producción, esto vendría de Vuex o de una API
    const productoId = this.$route.params.productoId;
    if (productoId) {
      // Cargar datos del producto
      console.log('Cargando producto:', productoId);
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.compra-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff8f0, #ffffff);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  background: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo img {
  height: 50px;
  cursor: pointer;
}

.btn-volver {
  background: #f0f0f0;
  color: #333;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-volver:hover {
  background: #e0e0e0;
  transform: translateX(-3px);
}

.contenido {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.progreso-compra {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.paso {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.circulo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s;
}

.paso.activo .circulo {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.paso.completado .circulo {
  background: #4CAF50;
  color: white;
}

.texto {
  font-size: 14px;
  color: #999;
  font-weight: 600;
}

.paso.activo .texto {
  color: #ff8a3d;
}

.linea {
  width: 100px;
  height: 4px;
  background: #e0e0e0;
  transition: all 0.3s;
}

.linea.activo {
  background: linear-gradient(to right, #ff8a3d, #ff6b35);
}

.contenedor-compra {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.paso-contenido h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.producto-seleccionado {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.producto-imagen-grande {
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.producto-imagen-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.producto-datos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.producto-datos h3 {
  color: #333;
  font-size: 24px;
}

.descripcion {
  color: #666;
  line-height: 1.6;
}

.agricultor-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
}

.agricultor-foto {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff8a3d;
}

.agricultor-info strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff8a3d;
  font-weight: bold;
}

.precio-unitario,
.stock-disponible {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.label {
  color: #666;
  font-weight: 500;
}

.valor {
  color: #333;
  font-weight: bold;
}

.selector-cantidad {
  background: #fff3e0;
  padding: 20px;
  border-radius: 12px;
}

.selector-cantidad label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 12px;
}

.cantidad-controles {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cantidad-controles button {
  width: 45px;
  height: 45px;
  border: none;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  font-size: 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.cantidad-controles button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.cantidad-controles button:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.cantidad-controles input {
  width: 100px;
  height: 45px;
  text-align: center;
  border: 2px solid #ff8a3d;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
}

.total-parcial {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.formulario-entrega {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.campos-fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-form,
.textarea-form {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
}

.input-form:focus,
.textarea-form:focus {
  outline: none;
  border-color: #ff8a3d;
  box-shadow: 0 0 0 3px rgba(255, 138, 61, 0.1);
}

.textarea-form {
  resize: vertical;
}

.resumen-compra {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

.seccion-resumen {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 15px;
}

.seccion-resumen h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
}

.producto-resumen {
  display: flex;
  align-items: center;
  gap: 20px;
}

.producto-resumen img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
}

.producto-resumen strong {
  display: block;
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
}

.producto-resumen p {
  color: #666;
  font-size: 14px;
}

.datos-entrega p {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.6;
}

.datos-entrega strong {
  color: #333;
  margin-right: 8px;
}

.total-section {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0cc 100%);
}

.desglose-pago {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.linea-pago {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #666;
}

.linea-pago.total {
  padding-top: 12px;
  border-top: 2px solid #ff8a3d;
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
}

.metodo-pago {
  margin-bottom: 30px;
}

.metodo-pago h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
}

.opciones-pago {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.opcion-pago {
  display: block;
  padding: 20px;
  background: #f9f9f9;
  border: 3px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.opcion-pago:hover {
  background: #fff3e0;
}

.opcion-pago.seleccionada {
  background: #fff3e0;
  border-color: #ff8a3d;
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.2);
}

.opcion-pago input[type="radio"] {
  display: none;
}

.contenido-opcion {
  display: flex;
  align-items: center;
  gap: 15px;
}

.contenido-opcion .icono {
  font-size: 32px;
}

.contenido-opcion strong {
  display: block;
  color: #333;
  margin-bottom: 5px;
}

.contenido-opcion p {
  color: #666;
  font-size: 13px;
}

.botones-navegacion {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
}

.btn-anterior,
.btn-siguiente,
.btn-confirmar {
  padding: 14px 40px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-anterior {
  background: #f0f0f0;
  color: #666;
}

.btn-anterior:hover {
  background: #e0e0e0;
}

.btn-siguiente,
.btn-confirmar {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  flex: 1;
}

.btn-siguiente:hover,
.btn-confirmar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 138, 61, 0.4);
}

.modal-exito {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.contenido-exito {
  background: white;
  border-radius: 25px;
  padding: 50px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  animation: aparecer 0.3s ease;
}

.icono-exito {
  width: 100px;
  height: 100px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  color: white;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.contenido-exito h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 28px;
}

.contenido-exito > p {
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

.info-pedido {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-pedido p {
  color: #666;
  margin: 10px 0;
}

.mensaje-final {
  color: #999;
  font-size: 14px;
  font-style: italic;
  margin-bottom: 25px;
}

.btn-cerrar-modal {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cerrar-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 138, 61, 0.4);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .producto-seleccionado {
    grid-template-columns: 1fr;
  }

  .producto-imagen-grande {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .progreso-compra {
    padding: 20px 10px;
  }

  .linea {
    width: 50px;
  }

  .circulo {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .texto {
    font-size: 12px;
  }

  .campos-fila {
    grid-template-columns: 1fr;
  }

  .opciones-pago {
    grid-template-columns: 1fr;
  }

  .botones-navegacion {
    flex-direction: column;
  }

  .btn-anterior {
    order: 2;
  }

  .contenido-exito {
    padding: 30px;
    margin: 20px;
  }
}
</style>
