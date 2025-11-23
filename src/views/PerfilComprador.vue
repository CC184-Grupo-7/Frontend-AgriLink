<template>
  <div class="perfil-comprador-page">
    <div class="navbar">
      <div class="logo" @click="$router.push('/productos')">
        <img src="https://cdn-icons-png.flaticon.com/512/628/628283.png" alt="Logo">
      </div>
      <button class="btn-salir" @click="salir">Salir</button>
    </div>

    <div class="contenido">
      <div class="sidebar">
        <div class="foto-perfil-container" @click="cambiarSeccion('perfil')">
          <img :src="usuario.foto" alt="Perfil" class="foto-perfil">
        </div>

        <div class="menu-opciones">
          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'perfil' }"
            @click="cambiarSeccion('perfil')"
          >
            <span class="icono">👤</span>
            <div class="texto">
              <strong>Mi Perfil</strong>
              <p>Actualiza tus datos personales</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'compras' }"
            @click="cambiarSeccion('compras')"
          >
            <span class="icono">🛒</span>
            <div class="texto">
              <strong>Mis Compras</strong>
              <p>Historial de pedidos</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'pendientes' }"
            @click="cambiarSeccion('pendientes')"
          >
            <span class="icono">🕐</span>
            <div class="texto">
              <strong>Pedidos Pendientes</strong>
              <p>Compras en proceso</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'favoritos' }"
            @click="cambiarSeccion('favoritos')"
          >
            <span class="icono">❤️</span>
            <div class="texto">
              <strong>Favoritos</strong>
              <p>Productos guardados</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contenido-principal">
        <!-- Sección Perfil -->
        <div v-if="seccionActiva === 'perfil'" class="seccion">
          <div class="titulo-seccion">
            <div class="linea-izq"></div>
            <h2>MI PERFIL</h2>
            <div class="linea-der"></div>
          </div>

          <div class="formulario-perfil">
            <div class="foto-actualizar">
              <div class="foto-perfil-preview">
                <img v-if="usuario.foto" :src="usuario.foto" alt="Foto de perfil" class="img-preview">
                <div v-else class="icono-usuario">👤</div>
              </div>
              
              <input 
                type="file" 
                ref="fotoPerfilInput"
                @change="handleFotoPerfilUpload"
                accept="image/*"
                style="display: none"
              >
              
              <button 
                class="btn-actualizar-foto" 
                @click="$refs.fotoPerfilInput.click()"
              >
                Actualizar foto
              </button>
            </div>

            <div class="campos-perfil">
              <h3>Información Personal</h3>
              
              <div class="campo">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  v-model="usuario.nombre" 
                  placeholder="Ingresa tu nombre completo"
                  class="input-perfil"
                >
              </div>

              <div class="campo">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="usuario.email" 
                  placeholder="tu@email.com"
                  class="input-perfil"
                >
              </div>

              <div class="campo">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  v-model="usuario.telefono" 
                  placeholder="+51 999 888 777"
                  class="input-perfil"
                >
              </div>

              <div class="campo">
                <label>Dirección de Entrega</label>
                <textarea 
                  v-model="usuario.direccion" 
                  placeholder="Ingresa tu dirección completa"
                  class="textarea-perfil"
                  rows="2"
                ></textarea>
              </div>
              
              <button class="btn-actualizar" @click="actualizarPerfil">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        <!-- Sección Mis Compras -->
        <div v-if="seccionActiva === 'compras'" class="seccion">
          <div class="titulo-seccion">
            <div class="linea-izq"></div>
            <h2>MIS COMPRAS</h2>
            <div class="linea-der"></div>
          </div>

          <div class="lista-compras">
            <div v-for="compra in historialCompras" :key="compra.id" class="compra-item">
              <div class="compra-imagen">
                <img :src="compra.imagen" :alt="compra.producto">
              </div>
              <div class="compra-info">
                <h4>{{ compra.producto }}</h4>
                <p class="agricultor">Vendedor: {{ compra.agricultor }}</p>
                <div class="compra-detalles">
                  <span class="cantidad">{{ compra.cantidad }}</span>
                  <span class="fecha">{{ compra.fecha }}</span>
                </div>
              </div>
              <div class="compra-monto">
                <span class="total">S/ {{ compra.total }}</span>
                <span class="estado" :class="compra.estado.toLowerCase()">
                  {{ compra.estado }}
                </span>
              </div>
            </div>

            <div v-if="historialCompras.length === 0" class="sin-datos">
              No tienes compras realizadas aún
            </div>
          </div>
        </div>

        <!-- Sección Pendientes -->
        <div v-if="seccionActiva === 'pendientes'" class="seccion">
          <div class="titulo-seccion">
            <div class="linea-izq"></div>
            <h2>PEDIDOS PENDIENTES</h2>
            <div class="linea-der"></div>
          </div>

          <div class="lista-pendientes">
            <div v-for="pedido in pedidosPendientes" :key="pedido.id" class="pedido-item">
              <div class="pedido-imagen">
                <img :src="pedido.imagen" :alt="pedido.producto">
              </div>
              <div class="pedido-info">
                <h4>{{ pedido.producto }}</h4>
                <p class="agricultor">Vendedor: {{ pedido.agricultor }}</p>
                <p class="tiempo">Solicitado hace {{ pedido.tiempo }}</p>
              </div>
              <div class="pedido-acciones">
                <span class="total">S/ {{ pedido.total }}</span>
                <span class="estado-pendiente">En espera</span>
                <button class="btn-cancelar" @click="cancelarPedido(pedido.id)">
                  Cancelar
                </button>
              </div>
            </div>

            <div v-if="pedidosPendientes.length === 0" class="sin-datos">
              No tienes pedidos pendientes
            </div>
          </div>
        </div>

        <!-- Sección Favoritos -->
        <div v-if="seccionActiva === 'favoritos'" class="seccion">
          <div class="titulo-seccion">
            <div class="linea-izq"></div>
            <h2>MIS FAVORITOS</h2>
            <div class="linea-der"></div>
          </div>

          <div class="lista-favoritos">
            <div v-for="favorito in productosFavoritos" :key="favorito.id" class="favorito-item">
              <div class="favorito-imagen">
                <img :src="favorito.imagen" :alt="favorito.nombre">
                <button class="btn-quitar-favorito" @click="quitarFavorito(favorito.id)">
                  ❌
                </button>
              </div>
              <div class="favorito-info">
                <h4>{{ favorito.nombre }}</h4>
                <p class="descripcion">{{ favorito.descripcion }}</p>
                <div class="favorito-detalles">
                  <span class="precio">S/ {{ favorito.precio }}/Kg</span>
                  <span class="stock">Stock: {{ favorito.stock }} Kg</span>
                </div>
              </div>
              <div class="favorito-acciones">
                <button class="btn-comprar" @click="irAComprar(favorito)">
                  Comprar
                </button>
              </div>
            </div>

            <div v-if="productosFavoritos.length === 0" class="sin-datos">
              No tienes productos favoritos guardados
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerfilCompradorPage',
  data() {
    return {
      seccionActiva: 'perfil',
      
      usuario: {
        foto: require('@/images/fotouser.jpg'),
        nombre: 'María García',
        email: 'maria.garcia@email.com',
        telefono: '+51 987 654 321',
        direccion: 'Av. Larco 1234, Miraflores, Lima'
      },

      historialCompras: [
        {
          id: 1,
          producto: 'Mangos dulces',
          agricultor: 'Luis Mendoza',
          cantidad: '5 Kg',
          fecha: '20/11/2024',
          total: '35.00',
          estado: 'Entregado',
          imagen: require('@/images/mango.jpg')
        },
        {
          id: 2,
          producto: 'Papas premium',
          agricultor: 'Luis Mendoza',
          cantidad: '10 Kg',
          fecha: '18/11/2024',
          total: '72.00',
          estado: 'Entregado',
          imagen: require('@/images/papas.jpg')
        },
        {
          id: 3,
          producto: 'Tomates orgánicos',
          agricultor: 'María Torres',
          cantidad: '8 Kg',
          fecha: '15/11/2024',
          total: '41.60',
          estado: 'Entregado',
          imagen: require('@/images/tomates.jpg')
        }
      ],

      pedidosPendientes: [
        {
          id: 1,
          producto: 'Lechuga fresca',
          agricultor: 'María Torres',
          tiempo: '3 horas',
          total: '17.50',
          imagen: require('@/images/lechuga.jpg')
        }
      ],

      productosFavoritos: [
        {
          id: 1,
          nombre: 'Mangos dulces',
          descripcion: 'Mangos frescos y jugosos',
          precio: 7,
          stock: 20,
          imagen: require('@/images/mango.jpg')
        },
        {
          id: 2,
          nombre: 'Limones frescos',
          descripcion: 'Limones ácidos y aromáticos',
          precio: 4.0,
          stock: 40,
          imagen: require('@/images/limon.jpg')
        }
      ]
    }
  },

  methods: {
    cambiarSeccion(seccion) {
      this.seccionActiva = seccion;
    },

    handleFotoPerfilUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.usuario.foto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    actualizarPerfil() {
      alert('Perfil actualizado correctamente');
    },

    cancelarPedido(pedidoId) {
      if (confirm('¿Estás seguro de cancelar este pedido?')) {
        const index = this.pedidosPendientes.findIndex(p => p.id === pedidoId);
        if (index !== -1) {
          this.pedidosPendientes.splice(index, 1);
          alert('Pedido cancelado exitosamente');
        }
      }
    },

    quitarFavorito(favoritoId) {
      const index = this.productosFavoritos.findIndex(f => f.id === favoritoId);
      if (index !== -1) {
        this.productosFavoritos.splice(index, 1);
      }
    },

    irAComprar(producto) {
      this.$router.push({
        name: 'Compra',
        params: { productoId: producto.id }
      });
    },

    salir() {
      this.$router.push('/login');
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

.perfil-comprador-page {
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

.btn-salir {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-salir:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.contenido {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  gap: 30px;
}

.sidebar {
  width: 280px;
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  position: sticky;
  top: 100px;
}

.foto-perfil-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  cursor: pointer;
}

.foto-perfil {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ff8a3d;
  transition: all 0.3s;
}

.foto-perfil:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(255, 138, 61, 0.3);
}

.menu-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f9f9f9;
}

.opcion:hover {
  background: #fff3e0;
  transform: translateX(5px);
}

.opcion.activo {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
}

.icono {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;
}

.opcion.activo .icono {
  background: rgba(255,255,255,0.2);
}

.texto strong {
  display: block;
  font-size: 14px;
  margin-bottom: 3px;
}

.texto p {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.3;
}

.contenido-principal {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.linea-izq,
.linea-der {
  flex: 1;
  height: 3px;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  border-radius: 10px;
}

.titulo-seccion h2 {
  color: #ff8a3d;
  font-size: 28px;
  white-space: nowrap;
}

.formulario-perfil {
  display: flex;
  gap: 40px;
  margin-top: 30px;
}

.foto-actualizar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.foto-perfil-preview {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  border: 4px solid #ff8a3d;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icono-usuario {
  font-size: 80px;
}

.btn-actualizar-foto {
  padding: 12px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
}

.btn-actualizar-foto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.campos-perfil {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.campos-perfil h3 {
  color: #333;
  margin-bottom: 10px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  color: #666;
  font-weight: 500;
  font-size: 14px;
}

.input-perfil,
.textarea-perfil {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
}

.input-perfil:focus,
.textarea-perfil:focus {
  outline: none;
  border-color: #ff8a3d;
  box-shadow: 0 0 0 3px rgba(255, 138, 61, 0.1);
}

.textarea-perfil {
  resize: vertical;
}

.btn-actualizar {
  padding: 14px 30px;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: all 0.3s;
  align-self: flex-start;
}

.btn-actualizar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.lista-compras,
.lista-pendientes {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.compra-item,
.pedido-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s;
}

.compra-item:hover,
.pedido-item:hover {
  background: #fff3e0;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.2);
}

.compra-imagen,
.pedido-imagen {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.compra-imagen img,
.pedido-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compra-info,
.pedido-info {
  flex: 1;
}

.compra-info h4,
.pedido-info h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
}

.agricultor {
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}

.compra-detalles {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #999;
}

.compra-monto,
.pedido-acciones {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.total {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b35;
}

.estado {
  padding: 6px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.estado.entregado {
  background: #e8f5e9;
  color: #2e7d32;
}

.estado-pendiente {
  padding: 6px 15px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  background: #fff3e0;
  color: #ff8a3d;
}

.tiempo {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}

.btn-cancelar {
  padding: 8px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  transition: all 0.3s;
}

.btn-cancelar:hover {
  background: #da190b;
  transform: translateY(-2px);
}

.lista-favoritos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.favorito-item {
  background: #f9f9f9;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
}

.favorito-item:hover {
  background: #fff3e0;
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 138, 61, 0.2);
}

.favorito-imagen {
  width: 100%;
  height: 200px;
  position: relative;
}

.favorito-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-quitar-favorito {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.btn-quitar-favorito:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.favorito-info {
  padding: 20px;
}

.favorito-info h4 {
  color: #333;
  margin-bottom: 8px;
}

.descripcion {
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.4;
}

.favorito-detalles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.precio {
  background: linear-gradient(135deg, #ffe0cc 0%, #ffd4b8 100%);
  color: #ff6b35;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 14px;
}

.stock {
  color: #666;
  font-size: 12px;
}

.favorito-acciones {
  padding: 0 20px 20px;
}

.btn-comprar {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-comprar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.sin-datos {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-style: italic;
}

@media (max-width: 1024px) {
  .contenido {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .formulario-perfil {
    flex-direction: column;
  }

  .lista-favoritos {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .lista-favoritos {
    grid-template-columns: 1fr;
  }

  .compra-item,
  .pedido-item {
    flex-direction: column;
    text-align: center;
  }

  .compra-monto,
  .pedido-acciones {
    align-items: center;
    width: 100%;
  }

  .btn-cancelar {
    width: 100%;
  }
}
</style>
