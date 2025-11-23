<template>
  <div class="perfil-page">
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
            :class="{ activo: seccionActiva === 'productos' }"
            @click="cambiarSeccion('productos')"
          >
            <span class="icono">📦</span>
            <div class="texto">
              <strong>Mis productos</strong>
              <p>Mira tus productos a la venta</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'historial' }"
            @click="cambiarSeccion('historial')"
          >
            <span class="icono">📋</span>
            <div class="texto">
              <strong>Historial de ventas</strong>
              <p>Actualiza tus datos físicos y más</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'resenas' }"
            @click="cambiarSeccion('resenas')"
          >
            <span class="icono">⭐</span>
            <div class="texto">
              <strong>Reseñas</strong>
              <p>Descubre simulacros.</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'pendientes' }"
            @click="cambiarSeccion('pendientes')"
          >
            <span class="icono">🕐</span>
            <div class="texto">
              <strong>Ventas Pendientes</strong>
              <p>Mira el historial de pedidos solicitados</p>
            </div>
          </div>

          <div 
            class="opcion"
            :class="{ activo: seccionActiva === 'publicar' }"
            @click="cambiarSeccion('publicar')"
          >
            <span class="icono">📦</span>
            <div class="texto">
              <strong>Publicar productos</strong>
              <p>Publica tus productos para que estén a la venta!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contenido-principal">
        <div v-if="seccionActiva === 'perfil'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>PERFIL</h2>
            <div class="linea-der"></div>
          </div>

          <h3 class="subtitulo">Actualiza tus datos</h3>

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
                type="button"
              >
                Actualizar foto
              </button>
              
              <button 
                v-if="usuario.foto !== require('@/images/fotouser.jpg')"
                class="btn-quitar-foto" 
                @click="quitarFotoPerfil"
                type="button"
              >
                Quitar foto
              </button>
            </div>

            <div class="campos-perfil">
              <h3>Actualiza tus datos</h3>
              
              <input 
                type="text" 
                v-model="usuario.permisos" 
                placeholder="Actualiza tus Permisos"
                class="input-perfil"
              >
              
              <textarea 
                v-model="usuario.descripcion" 
                placeholder="Ingresa tu descripcion"
                class="textarea-perfil"
                rows="3"
              ></textarea>
              
              <input 
                type="text" 
                v-model="usuario.sexo" 
                placeholder="Ingresa tu sexo"
                class="input-perfil"
              >
              
              <input 
                type="text" 
                v-model="usuario.nombres" 
                placeholder="Ingresa tus nombres"
                class="input-perfil"
              >
              
              <input 
                type="number" 
                v-model="usuario.edad" 
                placeholder="Ingresa tu edad"
                class="input-perfil"
              >
              
              <button class="btn-actualizar" @click="actualizarPerfil">
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div v-if="seccionActiva === 'productos'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>Mis Productos</h2>
            <div class="linea-der"></div>
          </div>
          <div class="lista-mis-productos">
            <div v-for="producto in misProductos" :key="producto.id" class="producto-item">
              <img :src="producto.imagen" :alt="producto.nombre">
              <div class="info-producto">
                <h3>{{ producto.nombre }}</h3>
                <p>{{ producto.descripcion }}</p>
                <span class="precio">S/{{ producto.precio }}Kg</span>
              </div>
              <div class="acciones-producto">
                <button class="btn-editar" @click="editarProducto(producto)">Editar</button>
                <button class="btn-eliminar" @click="eliminarProducto(producto.id)">Eliminar</button>
              </div>
            </div>
            <div v-if="misProductos.length === 0" class="sin-productos">
              No tienes productos publicados aún
            </div>
          </div>
        </div>

        <div v-if="seccionActiva === 'historial'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>Historial de Ventas</h2>
            <div class="linea-der"></div>
          </div>
          <div class="tabla-ventas">
            <div class="venta-item" v-for="venta in historialVentas" :key="venta.id">
              <div class="venta-info">
                <span class="fecha">{{ venta.fecha }}</span>
                <span class="producto">{{ venta.producto }}</span>
                <span class="cantidad">{{ venta.cantidad }}Kg</span>
                <span class="total">S/{{ venta.total }}</span>
              </div>
              <span class="estado" :class="venta.estado">{{ venta.estado }}</span>
            </div>
            <div v-if="historialVentas.length === 0" class="sin-ventas">
              No tienes ventas registradas aún
            </div>
          </div>
        </div>

        <div v-if="seccionActiva === 'resenas'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>Reseñas de Clientes</h2>
            <div class="linea-der"></div>
          </div>

          <div class="resumen-rating">
            <div class="rating-grande">
              <span class="numero">{{ promedioRating }}</span>
              <div class="estrellas-display">
                <span 
                  v-for="n in 5" 
                  :key="n"
                  class="estrella-rating"
                  :class="{ llena: n <= Math.round(promedioRating) }"
                >
                  {{ n <= Math.round(promedioRating) ? '⭐' : '☆' }}
                </span>
              </div>
              <span class="total">{{ totalResenas }} reseña{{ totalResenas !== 1 ? 's' : '' }}</span>
            </div>
          </div>

          <div class="lista-resenas">
            <div v-for="resena in resenas" :key="resena.id" class="resena-item">
              <div class="resena-header">
                <span class="nombre">{{ resena.cliente }}</span>
                <div class="estrellas-resena">
                  <span 
                    v-for="n in 5" 
                    :key="n"
                    class="estrella-item"
                    :class="{ activa: n <= resena.rating }"
                  >
                    {{ n <= resena.rating ? '⭐' : '☆' }}
                  </span>
                </div>
              </div>
              <p class="comentario">{{ resena.comentario }}</p>
              <span class="fecha-resena">{{ resena.fecha }}</span>
            </div>
            <div v-if="resenas.length === 0" class="sin-resenas">
              No tienes reseñas todavía
            </div>
          </div>
        </div>

        <div v-if="seccionActiva === 'pendientes'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>Ventas Pendientes</h2>
            <div class="linea-der"></div>
          </div>

          <p class="subtitulo-lista">Lista de ventas pendientes a confirmar</p>

          <div class="contenedor-lista-figma">
            <div v-for="pedido in ventasPendientes" :key="pedido.id">
              <div 
                v-if="pedidoExpandido?.id !== pedido.id"
                class="item-lista-figma"
                @click="expandirPedido(pedido)"
              >
                <div class="avatar-item">
                  <div class="icono-avatar">👤</div>
                </div>
                <div class="info-item">
                  <h4>{{ pedido.cliente }}</h4>
                  <p class="detalle-pedido">{{ pedido.producto }}</p>
                  <p class="detalle-pedido">Hace {{ pedido.tiempo }}</p>
                </div>
                <div class="acciones-item">
                  <button class="btn-accion">
                    <span class="icono-accion">⬇</span>
                  </button>
                  <img :src="pedido.imagenProducto" class="thumb-producto" alt="producto">
                </div>
              </div>

              <div v-else class="pedido-expandido-figma">
                <div class="header-expandido" @click="cerrarPedido">
                  <div class="avatar-item">
                    <div class="icono-avatar">👤</div>
                  </div>
                  <div class="info-item">
                    <h4>{{ pedido.cliente }}</h4>
                    <p class="detalle-pedido">{{ pedido.producto }}</p>
                    <p class="detalle-pedido">Hace {{ pedido.tiempo }}</p>
                  </div>
                  <div class="acciones-item">
                    <button class="btn-accion">
                      <span class="icono-accion">⬆</span>
                    </button>
                    <img :src="pedido.imagenProducto" class="thumb-producto" alt="producto">
                  </div>
                </div>

                <div class="detalle-expandido">
                  <div class="grid-detalles">
                    <div class="seccion-info">
                      <div class="item-detalle">
                        <span class="label-detalle">📧 Email</span>
                        <span class="valor-detalle">{{ pedido.email }}</span>
                      </div>

                      <div class="item-detalle">
                        <span class="label-detalle">📱 Telefono</span>
                        <span class="valor-detalle">{{ pedido.telefono }}</span>
                      </div>

                      <div class="item-detalle">
                        <span class="label-detalle">📦 Producto</span>
                        <span class="valor-detalle">{{ pedido.producto }}</span>
                      </div>

                      <div class="item-detalle">
                        <span class="label-detalle">⚖️ Cantidad</span>
                        <span class="valor-detalle">{{ pedido.cantidad }}</span>
                      </div>

                      <div class="item-detalle">
                        <span class="label-detalle">💰 Total a pagar</span>
                        <span class="valor-detalle precio-total">S/ {{ pedido.total }}</span>
                      </div>
                    </div>

                    <div class="seccion-acciones">
                      <div class="imagen-producto-grande">
                        <img :src="pedido.imagenProducto" alt="Producto">
                      </div>

                      <div class="botones-confirmacion">
                        <button class="btn-confirmar-venta" @click="confirmarVenta(pedido.id)">
                          <span class="icono-btn">✓</span>
                          Confirmar Venta
                        </button>
                        <button class="btn-cancelar-venta" @click="cancelarVenta(pedido.id)">
                          <span class="icono-btn">✕</span>
                          Cancelar Pedido
                        </button>
                      </div>

                      <div class="tiempo-pedido">
                        <span class="icono-reloj">🕐</span>
                        Solicitado hace {{ pedido.tiempo }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="ventasPendientes.length === 0" class="sin-pendientes">
              No tienes ventas pendientes
            </div>
          </div>
        </div>

        <div v-if="seccionActiva === 'publicar'" class="seccion">
          <div class="titulo-seccion-figma">
            <div class="linea-izq"></div>
            <h2>Publicar Producto</h2>
            <div class="linea-der"></div>
          </div>

          <div class="formulario-figma">
            <div class="columna-izq">
              <div class="campo-form">
                <label>Nombre del producto</label>
                <input 
                  type="text" 
                  v-model="nuevoProducto.nombre" 
                  placeholder="Ej: Mangos dulces"
                  class="input-figma"
                >
              </div>

              <div class="campo-form">
                <label>Descripcion corta</label>
                <textarea 
                  v-model="nuevoProducto.descripcion" 
                  placeholder="Describe brevemente tu producto..."
                  class="textarea-figma"
                  rows="3"
                ></textarea>
              </div>

              <div class="campo-form">
                <label>Descripcion detallada</label>
                <textarea 
                  v-model="nuevoProducto.descripcionLarga" 
                  placeholder="Cuenta mas sobre tu producto, como lo cultivas, etc..."
                  class="textarea-figma"
                  rows="4"
                ></textarea>
              </div>

              <div class="campos-fila">
                <div class="campo-form campo-mitad">
                  <label>Precio (S/ por Kg)</label>
                  <input 
                    type="number" 
                    v-model.number="nuevoProducto.precio" 
                    placeholder="7.50"
                    step="0.1"
                    class="input-figma"
                  >
                </div>

                <div class="campo-form campo-mitad">
                  <label>Stock disponible (Kg)</label>
                  <input 
                    type="number" 
                    v-model.number="nuevoProducto.stock" 
                    placeholder="50"
                    class="input-figma"
                  >
                </div>
              </div>

              <div class="campo-form">
                <label>Categoria</label>
                <select v-model="nuevoProducto.categoria" class="select-figma">
                  <option value="">Selecciona una categoria</option>
                  <option value="Tuberculos">Tuberculos</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Citricos">Citricos</option>
                </select>
              </div>
            </div>

            <div class="columna-der">
              <div class="subir-imagen">
                <label>Imagen del producto</label>
                
                <div class="preview-imagen-figma">
                  <img v-if="imagenPreview" :src="imagenPreview" alt="Preview">
                  <div v-else class="placeholder-imagen-figma">
                    <span class="icono-placeholder">🖼️</span>
                    <p>Vista previa de la imagen</p>
                  </div>
                </div>

                <input 
                  type="file" 
                  ref="imagenInput"
                  @change="handleImagenUpload"
                  accept="image/*"
                  style="display: none"
                >

                <button 
                  class="btn-subir-imagen" 
                  @click="$refs.imagenInput.click()"
                  type="button"
                >
                  📁 Subir imagen
                </button>

                <div v-if="nuevoProducto.imagenNombre" class="info-imagen">
                  <span class="nombre-archivo">{{ nuevoProducto.imagenNombre }}</span>
                  <button class="btn-quitar-imagen" @click="quitarImagen" type="button">×</button>
                </div>

                <p class="ayuda-upload">
                  Sube una imagen clara de tu producto. Formatos aceptados: JPG, PNG. Tamaño máximo: 5MB.
                </p>
              </div>
            </div>
          </div>

          <div class="botones-form">
            <button class="btn-cancelar-figma" @click="cancelarPublicacion">
              Cancelar
            </button>
            <button class="btn-publicar-figma" @click="publicarProducto">
              Publicar Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerfilPage',
  data() {
    return {
      seccionActiva: 'productos',
      pedidoExpandido: null,
      imagenPreview: null,
      
      usuario: {
        foto: require('@/images/fotouser.jpg'),
        permisos: 'Agricultor',
        descripcion: 'Agricultor de tercera generacion dedicado a producir alimentos frescos y organicos',
        sexo: 'Masculino',
        nombres: 'Luis Mendoza',
        edad: 45
      },

      misProductos: [
        {
          id: 1,
          nombre: 'Mangos dulces',
          descripcion: 'Mangos frescos y jugosos de la mejor calidad',
          imagen: require('@/images/mango.jpg'),
          precio: 7,
          stock: 20
        },
        {
          id: 2,
          nombre: 'Papas premium',
          descripcion: 'Papas frescas de excelente calidad',
          imagen: require('@/images/papas.jpg'),
          precio: 7.2,
          stock: 25
        },
        {
          id: 3,
          nombre: 'Naranjas jugosas',
          descripcion: 'Naranjas frescas llenas de sabor',
          imagen: require('@/images/zanahorias.jpg'),
          precio: 4.8,
          stock: 28
        }
      ],

      historialVentas: [
        {
          id: 1,
          fecha: '20/11/2024',
          producto: 'Mangos dulces',
          cantidad: 10,
          total: 70,
          estado: 'Completada'
        },
        {
          id: 2,
          fecha: '18/11/2024',
          producto: 'Papas premium',
          cantidad: 15,
          total: 108,
          estado: 'Completada'
        },
        {
          id: 3,
          fecha: '15/11/2024',
          producto: 'Naranjas jugosas',
          cantidad: 20,
          total: 96,
          estado: 'Completada'
        }
      ],

      resenas: [
        {
          id: 1,
          cliente: 'Maria Garcia',
          rating: 5,
          comentario: 'Excelente calidad de productos, muy frescos y deliciosos. Totalmente recomendado!',
          fecha: '19/11/2024'
        },
        {
          id: 2,
          cliente: 'Carlos Rodriguez',
          rating: 4,
          comentario: 'Buenos productos, la entrega fue rapida y todo llego en perfecto estado.',
          fecha: '17/11/2024'
        },
        {
          id: 3,
          cliente: 'Ana Martinez',
          rating: 5,
          comentario: 'Los mangos estaban deliciosos! Definitivamente volvere a comprar.',
          fecha: '14/11/2024'
        }
      ],

      ventasPendientes: [
        {
          id: 1,
          cliente: 'Pedro Sanchez',
          producto: 'Mangos dulces',
          tiempo: '2 horas',
          email: 'pedro.sanchez@email.com',
          telefono: '+51 999 888 777',
          cantidad: '8 Kg',
          total: '56.00',
          imagenProducto: require('@/images/mango.jpg')
        },
        {
          id: 2,
          cliente: 'Laura Torres',
          producto: 'Papas premium',
          tiempo: '5 horas',
          email: 'laura.torres@email.com',
          telefono: '+51 987 654 321',
          cantidad: '12 Kg',
          total: '86.40',
          imagenProducto: require('@/images/papas.jpg')
        }
      ],

      nuevoProducto: {
        nombre: '',
        descripcion: '',
        descripcionLarga: '',
        precio: null,
        stock: null,
        categoria: '',
        imagen: null,
        imagenNombre: ''
      }
    }
  },

  computed: {
    promedioRating() {
      if (this.resenas.length === 0) return 0;
      const suma = this.resenas.reduce((acc, r) => acc + r.rating, 0);
      return (suma / this.resenas.length).toFixed(1);
    },
    totalResenas() {
      return this.resenas.length;
    }
  },

  methods: {
    cambiarSeccion(seccion) {
      this.seccionActiva = seccion;
      this.pedidoExpandido = null;
    },

    expandirPedido(pedido) {
      this.pedidoExpandido = pedido;
    },

    cerrarPedido() {
      this.pedidoExpandido = null;
    },

    confirmarVenta(pedidoId) {
      const index = this.ventasPendientes.findIndex(p => p.id === pedidoId);
      if (index !== -1) {
        const pedido = this.ventasPendientes[index];
        
        this.historialVentas.unshift({
          id: Date.now(),
          fecha: new Date().toLocaleDateString('es-PE'),
          producto: pedido.producto,
          cantidad: parseInt(pedido.cantidad),
          total: parseFloat(pedido.total),
          estado: 'Completada'
        });

        this.ventasPendientes.splice(index, 1);
        this.pedidoExpandido = null;
        
        alert('¡Venta confirmada exitosamente!');
      }
    },

    cancelarVenta(pedidoId) {
      if (confirm('¿Estas seguro de cancelar este pedido?')) {
        const index = this.ventasPendientes.findIndex(p => p.id === pedidoId);
        if (index !== -1) {
          this.ventasPendientes.splice(index, 1);
          this.pedidoExpandido = null;
          alert('Pedido cancelado');
        }
      }
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

    quitarFotoPerfil() {
      this.usuario.foto = require('@/images/fotouser.jpg');
    },

    actualizarPerfil() {
      alert('Perfil actualizado correctamente');
    },

    editarProducto(producto) {
      alert(`Editar producto: ${producto.nombre}`);
    },

    eliminarProducto(productoId) {
      if (confirm('¿Estas seguro de eliminar este producto?')) {
        const index = this.misProductos.findIndex(p => p.id === productoId);
        if (index !== -1) {
          this.misProductos.splice(index, 1);
          alert('Producto eliminado');
        }
      }
    },

    handleImagenUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.nuevoProducto.imagenNombre = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagenPreview = e.target.result;
          this.nuevoProducto.imagen = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    quitarImagen() {
      this.imagenPreview = null;
      this.nuevoProducto.imagen = null;
      this.nuevoProducto.imagenNombre = '';
      this.$refs.imagenInput.value = '';
    },

    publicarProducto() {
      if (!this.nuevoProducto.nombre || !this.nuevoProducto.descripcion || 
          !this.nuevoProducto.precio || !this.nuevoProducto.stock || 
          !this.nuevoProducto.categoria || !this.nuevoProducto.imagen) {
        alert('Por favor completa todos los campos');
        return;
      }

      const producto = {
        id: Date.now(),
        nombre: this.nuevoProducto.nombre,
        descripcion: this.nuevoProducto.descripcion,
        imagen: this.nuevoProducto.imagen,
        precio: this.nuevoProducto.precio,
        stock: this.nuevoProducto.stock
      };

      this.misProductos.unshift(producto);
      
      alert('¡Producto publicado exitosamente!');
      
      this.cancelarPublicacion();
      this.cambiarSeccion('productos');
    },

    cancelarPublicacion() {
      this.nuevoProducto = {
        nombre: '',
        descripcion: '',
        descripcionLarga: '',
        precio: null,
        stock: null,
        categoria: '',
        imagen: null,
        imagenNombre: ''
      };
      this.imagenPreview = null;
      if (this.$refs.imagenInput) {
        this.$refs.imagenInput.value = '';
      }
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

.perfil-page {
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

.titulo-seccion-figma {
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

.titulo-seccion-figma h2 {
  color: #ff8a3d;
  font-size: 28px;
  white-space: nowrap;
}

.subtitulo {
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
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

.btn-actualizar-foto,
.btn-quitar-foto {
  padding: 12px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-actualizar-foto {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
}

.btn-actualizar-foto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.btn-quitar-foto {
  background: #f0f0f0;
  color: #666;
}

.btn-quitar-foto:hover {
  background: #e0e0e0;
}

.campos-perfil {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campos-perfil h3 {
  color: #333;
  margin-bottom: 10px;
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

.lista-mis-productos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.producto-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s;
}

.producto-item:hover {
  background: #fff3e0;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.2);
}

.producto-item img {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
}

.info-producto {
  flex: 1;
}

.info-producto h3 {
  color: #333;
  margin-bottom: 8px;
}

.info-producto p {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.precio {
  background: linear-gradient(135deg, #ffe0cc 0%, #ffd4b8 100%);
  color: #ff6b35;
  padding: 6px 15px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 14px;
  display: inline-block;
}

.acciones-producto {
  display: flex;
  gap: 10px;
}

.btn-editar,
.btn-eliminar {
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  font-size: 13px;
}

.btn-editar {
  background: #4CAF50;
  color: white;
}

.btn-editar:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-eliminar {
  background: #f44336;
  color: white;
}

.btn-eliminar:hover {
  background: #da190b;
  transform: translateY(-2px);
}

.sin-productos,
.sin-ventas,
.sin-resenas,
.sin-pendientes {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-style: italic;
}

.tabla-ventas {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.venta-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.venta-item:hover {
  background: #fff3e0;
  transform: translateX(5px);
}

.venta-info {
  display: flex;
  gap: 30px;
  flex: 1;
}

.venta-info span {
  font-size: 14px;
  color: #666;
}

.estado {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 13px;
}

.estado.Completada {
  background: #e8f5e9;
  color: #2e7d32;
}

.resumen-rating {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0cc 100%);
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.rating-grande {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.numero {
  font-size: 72px;
  font-weight: bold;
  color: #ff8a3d;
}

.estrellas-display {
  display: flex;
  gap: 5px;
}

.estrella-rating {
  font-size: 32px;
}

.estrella-rating.llena {
  color: #ff8a3d;
}

.total {
  color: #666;
  font-size: 16px;
}

.lista-resenas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resena-item {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 15px;
  transition: all 0.3s;
}

.resena-item:hover {
  background: #fff3e0;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.1);
}

.resena-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nombre {
  font-weight: bold;
  color: #333;
}

.estrellas-resena {
  display: flex;
  gap: 2px;
}

.estrella-item {
  font-size: 18px;
  color: #ddd;
}

.estrella-item.activa {
  color: #ff8a3d;
}

.comentario {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.fecha-resena {
  color: #999;
  font-size: 12px;
}

.subtitulo-lista {
  color: #666;
  margin-bottom: 25px;
  font-size: 15px;
}

.contenedor-lista-figma {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-lista-figma {
  background: linear-gradient(to right, #fff8f0, #ffffff);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.item-lista-figma:hover {
  background: linear-gradient(to right, #fff3e0, #fff8f0);
  border-color: #ff8a3d;
  transform: translateX(5px);
}

.avatar-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icono-avatar {
  font-size: 32px;
}

.info-item {
  flex: 1;
}

.info-item h4 {
  color: #333;
  margin-bottom: 5px;
  font-size: 16px;
}

.detalle-pedido {
  color: #666;
  font-size: 13px;
  margin: 3px 0;
}

.acciones-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-accion {
  background: #ff8a3d;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-accion:hover {
  background: #ff6b35;
  transform: scale(1.1);
}

.icono-accion {
  color: white;
  font-size: 18px;
}

.thumb-producto {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #ff8a3d;
}

.pedido-expandido-figma {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  animation: expandir 0.3s ease;
}

.header-expandido {
  background: linear-gradient(to right, #fff3e0, #fff8f0);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  border-bottom: 2px solid #ff8a3d;
}

.detalle-expandido {
  padding: 30px;
}

.grid-detalles {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.seccion-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-detalle {
  background: #f9f9f9;
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label-detalle {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.valor-detalle {
  color: #333;
  font-weight: 500;
}

.precio-total {
  color: #ff6b35;
  font-size: 18px;
  font-weight: bold;
}

.seccion-acciones {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.imagen-producto-grande {
  width: 100%;
  height: 200px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.imagen-producto-grande img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.botones-confirmacion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-confirmar-venta,
.btn-cancelar-venta {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-confirmar-venta {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.btn-confirmar-venta:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.btn-cancelar-venta {
  background: white;
  color: #f44336;
  border: 2px solid #f44336;
}

.btn-cancelar-venta:hover {
  background: #f44336;
  color: white;
}

.icono-btn {
  font-size: 16px;
}

.tiempo-pedido {
  background: white;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icono-reloj {
  font-size: 18px;
}

.formulario-figma {
  background: linear-gradient(to bottom, #ff8a3d, #ff6b35);
  border-radius: 20px;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  margin-bottom: 20px;
}

.columna-izq,
.columna-der {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campo-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo-form label {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.input-figma,
.textarea-figma,
.select-figma {
  padding: 12px 15px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
}

.textarea-figma {
  resize: vertical;
}

.select-figma {
  cursor: pointer;
}

.campos-fila {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.campo-mitad {
  width: 100%;
}

.subir-imagen {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-imagen-figma {
  width: 100%;
  height: 280px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-imagen-figma img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-imagen-figma {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.icono-placeholder {
  font-size: 60px;
}

.btn-subir-imagen {
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px dashed rgba(255,255,255,0.5);
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #ff8a3d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-subir-imagen:hover {
  background: rgba(255,255,255,0.95);
  border-color: rgba(255,255,255,0.8);
}

.info-imagen {
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nombre-archivo {
  font-size: 13px;
  color: #666;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-quitar-imagen {
  background: #f44336;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-quitar-imagen:hover {
  background: #da190b;
}

.ayuda-upload {
  background: rgba(255,255,255,0.9);
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.botones-form {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-cancelar-figma,
.btn-publicar-figma {
  padding: 12px 40px;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancelar-figma {
  background: white;
  color: #666;
}

.btn-cancelar-figma:hover {
  background: #f0f0f0;
}

.btn-publicar-figma {
  background: linear-gradient(135deg, #ff8a3d, #ff6b35);
  color: white;
}

.btn-publicar-figma:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 138, 61, 0.4);
}

@keyframes expandir {
  from {
    opacity: 0;
    transform: scaleY(0.95);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

@media (max-width: 1200px) {
  .formulario-figma {
    grid-template-columns: 1fr;
  }
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
  
  .grid-detalles {
    grid-template-columns: 1fr;
  }
  
  .seccion-acciones {
    order: -1;
  }
  
  .campos-fila {
    grid-template-columns: 1fr;
  }
}
</style>
