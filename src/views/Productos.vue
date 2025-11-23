<template>
  <div class="productos-page">
    <div class="navbar">
      <div class="logo">
        <img src="https://cdn-icons-png.flaticon.com/512/628/628283.png" alt="Logo">
      </div>
      
      <div class="navbar-right">
        <button class="icon-btn" @click="toggleBusqueda">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>

        <button class="icon-btn" @click="toggleFiltros">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
        
        <button class="icon-btn" @click="verPerfil">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        
        <button class="btn-salir" @click="salir">Salir</button>
      </div>
    </div>

    <transition name="slide">
      <div v-if="mostrarBusqueda" class="busqueda-container">
        <div class="busqueda-wrapper">
          <svg class="icono-busqueda" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            v-model="busqueda" 
            placeholder="Buscar productos por nombre o descripcion..."
            class="input-busqueda"
            ref="busquedaInput"
          >
          <button v-if="busqueda" class="btn-limpiar" @click="limpiarBusqueda">×</button>
        </div>
        <div v-if="busqueda && productosOrdenados.length === 0" class="sin-resultados">
          No se encontraron productos
        </div>
        <div v-if="busqueda && productosOrdenados.length > 0" class="resultados-info">
          {{ productosOrdenados.length }} producto(s) encontrado(s)
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div v-if="mostrarFiltros" class="filtros-modal" @click="mostrarFiltros = false">
        <div class="filtros-contenido" @click.stop>
          <button class="cerrar-filtros" @click="mostrarFiltros = false">×</button>
          
          <div class="tabs">
            <button 
              :class="['tab', { active: tabActiva === 'filtros' }]" 
              @click="tabActiva = 'filtros'"
            >
              Filtros y Ordenar
            </button>
            <button 
              :class="['tab', { active: tabActiva === 'comparador' }]" 
              @click="tabActiva = 'comparador'"
            >
              Comparador ({{ productosComparar.length }}/3)
            </button>
          </div>

          <div v-if="tabActiva === 'filtros'" class="tab-contenido">
            <h3>Filtrar por Categoria</h3>
            <div class="categorias-filtro">
              <label v-for="cat in categorias" :key="cat" class="checkbox-label">
                <input type="checkbox" :value="cat" v-model="categoriasFiltro">
                {{ cat }}
              </label>
            </div>

            <h3>Rango de Precio</h3>
            <div class="precio-filtro">
              <div class="precio-inputs">
                <input type="number" v-model.number="precioMin" placeholder="Min" step="0.5">
                <span>-</span>
                <input type="number" v-model.number="precioMax" placeholder="Max" step="0.5">
              </div>
              <div class="precio-info">
                S/{{ precioMin }} - S/{{ precioMax }}
              </div>
            </div>

            <h3>Ordenar por</h3>
            <div class="ordenar-opciones">
              <button 
                v-for="opcion in opcionesOrden" 
                :key="opcion.valor"
                :class="['opcion-btn', { active: ordenActual === opcion.valor }]"
                @click="ordenarPor(opcion.valor)"
              >
                {{ opcion.texto }}
              </button>
            </div>

            <div class="filtros-acciones">
              <button class="btn-limpiar-filtros" @click="limpiarFiltros">Limpiar Filtros</button>
              <button class="btn-aplicar" @click="mostrarFiltros = false">Aplicar</button>
            </div>
          </div>

          <div v-if="tabActiva === 'comparador'" class="tab-contenido">
            <div v-if="productosComparar.length === 0" class="comparador-vacio">
              <p>Selecciona productos desde la lista para compararlos</p>
              <p class="hint">Haz click en el checkbox de cada producto</p>
            </div>

            <div v-else class="comparador-tabla">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th v-for="prod in productosComparar" :key="prod.id">
                      <img :src="prod.imagen" :alt="prod.nombre">
                      <span>{{ prod.nombre }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Precio</strong></td>
                    <td v-for="prod in productosComparar" :key="prod.id">
                      S/{{ prod.precio }}/Kg
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Rating</strong></td>
                    <td v-for="prod in productosComparar" :key="prod.id">
                      {{ prod.rating }} ⭐
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Stock</strong></td>
                    <td v-for="prod in productosComparar" :key="prod.id">
                      {{ prod.stock }} Kg
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Categoria</strong></td>
                    <td v-for="prod in productosComparar" :key="prod.id">
                      {{ prod.categoria }}
                    </td>
                  </tr>
                  <tr class="score-row">
                    <td><strong>Score Total</strong></td>
                    <td v-for="prod in productosComparar" :key="prod.id">
                      {{ calcularScore(prod) }}/100
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="recomendacion">
                <h4>Recomendacion</h4>
                <div class="mejor-opcion">
                  <img :src="mejorProducto.imagen" :alt="mejorProducto.nombre">
                  <div>
                    <strong>{{ mejorProducto.nombre }}</strong>
                    <p>Mejor relacion calidad-precio con {{ calcularScore(mejorProducto) }} puntos</p>
                  </div>
                </div>
              </div>

              <button class="btn-limpiar-comparador" @click="limpiarComparador">
                Limpiar Comparador
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="contenido">
      <div v-if="productosComparar.length > 0" class="banner-comparador">
        Comparando {{ productosComparar.length }} productos - 
        <button @click="abrirComparador">Ver comparacion</button>
      </div>

      <div class="lista-productos">
        <div 
          v-for="producto in productosOrdenados" 
          :key="producto.id"
          class="producto-wrapper"
        >
          <div 
            v-if="productoExpandido?.id !== producto.id"
            class="producto-card"
          >
            <div class="checkbox-comparar">
              <input 
                type="checkbox" 
                :checked="estaEnComparador(producto.id)"
                @change="toggleComparar(producto)"
                @click.stop
              >
            </div>
            
            <div class="card-contenido" @click="expandirProducto(producto)">
              <div class="card-izquierda">
                <img :src="producto.imagen" :alt="producto.nombre">
                <div class="info-basica">
                  <p class="descripcion">{{ producto.descripcion }}</p>
                  <span class="precio">S/{{ producto.precio }}/Kg</span>
                </div>
              </div>
              <button class="btn-expandir">▼</button>
            </div>
          </div>

          <div 
            v-else
            class="producto-expandido"
          >
            <div class="producto-header" @click="cerrarProducto">
              <div class="header-izquierda">
                <img :src="producto.imagen" :alt="producto.nombre" class="img-pequena">
                <p class="descripcion-corta">{{ producto.descripcion }}</p>
              </div>
              <div class="header-derecha">
                <span class="precio">S/{{ producto.precio }}/Kg</span>
                <button class="btn-colapsar">▲</button>
              </div>
            </div>
            
            <div class="producto-detalle">
              <div class="detalle-superior">
                <div class="agricultor-info">
                  <img :src="producto.agricultorImagen" alt="Agricultor" class="agricultor-img">
                  <div class="rating">
                    <span class="estrellas">{{ producto.rating }}</span>
                    <span class="estrella">⭐</span>
                  </div>
                </div>
                
                <div class="acciones">
                  <button class="btn-comprar" @click="comprarProducto(producto)">Comprar</button>
                  <div class="disponible">
                    Kg Disponibles: {{ producto.stock }}
                  </div>
                </div>
              </div>
              
              <div class="descripcion-larga">
                <p>{{ producto.descripcionLarga }}</p>
              </div>

              <div class="otros-productos-seccion">
                <h3>Mas productos de este agricultor</h3>
                <p class="info-agricultor">{{ producto.agricultorNombre }}</p>
                
                <div class="otros-productos">
                  <div 
                    v-for="otro in obtenerProductosAgricultor(producto.agricultorId, producto.id)" 
                    :key="otro.id"
                    class="producto-otro"
                    @click="expandirProducto(otro)"
                  >
                    <img :src="otro.imagen" :alt="otro.nombre">
                    <div class="otro-info">
                      <span class="otro-nombre">{{ otro.nombre }}</span>
                      <span class="otro-precio">S/{{ otro.precio }}/Kg</span>
                      <span class="otro-stock">Stock: {{ otro.stock }} Kg</span>
                    </div>
                  </div>
                </div>

                <div v-if="obtenerProductosAgricultor(producto.agricultorId, producto.id).length === 0" class="sin-otros">
                  Este agricultor solo tiene este producto disponible
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="mostrarModalPerfil" class="modal-perfil" @click="mostrarModalPerfil = false">
        <div class="perfil-contenido" @click.stop>
          <button class="cerrar" @click="mostrarModalPerfil = false">×</button>
          <div class="perfil-icono">👤</div>
          <h2>{{ nombreUsuario }}</h2>
          <div class="perfil-info">
            <p><strong>Email:</strong> usuario@example.com</p>
            <p><strong>Ubicacion:</strong> Lima, Peru</p>
          </div>
          <button class="btn-editar" @click="irAPerfil">Ver perfil completo</button>
          <button class="btn-configuracion">Configuracion</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ProductosPage',
  data() {
    return {
      nombreUsuario: 'Juan Perez',
      mostrarBusqueda: false,
      mostrarFiltros: false,
      mostrarModalPerfil: false,
      busqueda: '',
      productoExpandido: null,
      productosComparar: [],
      tabActiva: 'filtros',
      
      categoriasFiltro: [],
      precioMin: 0,
      precioMax: 20,
      ordenActual: 'ninguno',
      
      categorias: ['Tuberculos', 'Frutas', 'Verduras', 'Citricos'],
      
      opcionesOrden: [
        { valor: 'ninguno', texto: 'Sin ordenar' },
        { valor: 'precio-asc', texto: 'Precio: Menor a Mayor' },
        { valor: 'precio-desc', texto: 'Precio: Mayor a Menor' },
        { valor: 'rating-desc', texto: 'Mejor Valorados' },
        { valor: 'stock-desc', texto: 'Mayor Stock' },
      ],
      
      productos: [
        {
          id: 1,
          nombre: 'Papas premium',
          descripcion: 'Papas frescas, de excelente calidad y sabor. Perfectas para cocinar y disfrutar en cualquier receta, de la huerta a tu mesa.',
          descripcionLarga: 'Hola, mi nombre es Luis Mendoza y soy agricultor de tercera generacion. Desde joven, aprendi el arte de cultivar la tierra y, hoy en dia, me dedico a producir productos frescos como papas, naranjas y mangos, utilizando metodos sostenibles para cuidar tanto de la tierra como de las futuras cosechas. Mi finca esta ubicada en el corazon del valle.',
          imagen: require('@/images/papas.jpg'),
          precio: 7.2,
          rating: 4.8,
          stock: 25,
          categoria: 'Tuberculos',
          agricultorId: 1,
          agricultorNombre: 'Luis Mendoza',
          agricultorImagen: require('@/images/fotouser.jpg')
        },
        {
          id: 2,
          nombre: 'Mangos dulces',
          descripcion: 'Mangos dulces y jugosos, perfectos para disfrutar frescos o en postres. El toque tropical que necesitas para tu dia.',
          descripcionLarga: 'Hola, mi nombre es Luis Mendoza y soy agricultor de tercera generacion. Desde joven, aprendi el arte de cultivar la tierra y, hoy en dia, me dedico a producir productos frescos como papas, naranjas y mangos, utilizando metodos sostenibles para cuidar tanto de la tierra como de las futuras cosechas. Mi finca esta ubicada en el corazon del valle.',
          imagen: require('@/images/mango.jpg'),
          precio: 7,
          rating: 4.8,
          stock: 20,
          categoria: 'Frutas',
          agricultorId: 1,
          agricultorNombre: 'Luis Mendoza',
          agricultorImagen: require('@/images/fotouser.jpg')
        },
        {
          id: 3,
          nombre: 'Naranjas jugosas',
          descripcion: 'Naranjas frescas y jugosas, ideales para un zumo energetico o para disfrutar directamente. Sabor citrico incomparable.',
          descripcionLarga: 'Hola, mi nombre es Luis Mendoza y soy agricultor de tercera generacion. Desde joven, aprendi el arte de cultivar la tierra y, hoy en dia, me dedico a producir productos frescos como papas, naranjas y mangos, utilizando metodos sostenibles para cuidar tanto de la tierra como de las futuras cosechas. Mi finca esta ubicada en el corazon del valle.',
          imagen: require('@/images/zanahorias.jpg'),
          precio: 4.8,
          rating: 4.8,
          stock: 28,
          categoria: 'Citricos',
          agricultorId: 1,
          agricultorNombre: 'Luis Mendoza',
          agricultorImagen: require('@/images/fotouser.jpg')
        },
        {
          id: 4,
          nombre: 'Lechuga fresca',
          descripcion: 'Lechuga organica y crujiente, cultivada sin pesticidas. Perfecta para ensaladas saludables y deliciosas.',
          descripcionLarga: 'Soy Maria Torres, agricultora apasionada por la agricultura organica. Cultivo lechugas y tomates utilizando solo metodos naturales.',
          imagen: require('@/images/lechuga.jpg'),
          precio: 3.5,
          rating: 4.6,
          stock: 35,
          categoria: 'Verduras',
          agricultorId: 2,
          agricultorNombre: 'Maria Torres',
          agricultorImagen: require('@/images/fotouser.jpg')
        },
        {
          id: 5,
          nombre: 'Tomates organicos',
          descripcion: 'Tomates rojos y jugosos, cultivados organicamente. Ideales para salsas, ensaladas o consumo directo.',
          descripcionLarga: 'Soy Maria Torres, agricultora apasionada por la agricultura organica. Cultivo lechugas y tomates utilizando solo metodos naturales.',
          imagen: require('@/images/tomates.jpg'),
          precio: 5.2,
          rating: 4.7,
          stock: 30,
          categoria: 'Verduras',
          agricultorId: 2,
          agricultorNombre: 'Maria Torres',
          agricultorImagen: require('@/images/fotouser.jpg')
        },
        {
          id: 6,
          nombre: 'Limones frescos',
          descripcion: 'Limones acidos y aromaticos, perfectos para limonadas, aderezos y recetas que necesitan un toque citrico.',
          descripcionLarga: 'Soy Carlos Ramirez, especialista en citricos. Mis limones son conocidos por su acidez equilibrada y aroma intenso.',
          imagen: require('@/images/limon.jpg'),
          precio: 4.0,
          rating: 4.5,
          stock: 40,
          categoria: 'Citricos',
          agricultorId: 3,
          agricultorNombre: 'Carlos Ramirez',
          agricultorImagen: require('@/images/fotouser.jpg')
        }
      ]
    }
  },
  computed: {
    productosFiltrados() {
      let resultado = this.productos;
      
      if (this.busqueda) {
        const busquedaLower = this.busqueda.toLowerCase();
        resultado = resultado.filter(p => 
          p.nombre.toLowerCase().includes(busquedaLower) ||
          p.descripcion.toLowerCase().includes(busquedaLower) ||
          p.categoria.toLowerCase().includes(busquedaLower)
        );
      }
      
      if (this.categoriasFiltro.length > 0) {
        resultado = resultado.filter(p => this.categoriasFiltro.includes(p.categoria));
      }
      
      resultado = resultado.filter(p => 
        p.precio >= this.precioMin && p.precio <= this.precioMax
      );
      
      return resultado;
    },
    
    productosOrdenados() {
      let resultado = [...this.productosFiltrados];
      
      switch(this.ordenActual) {
        case 'precio-asc':
          resultado.sort((a, b) => a.precio - b.precio);
          break;
        case 'precio-desc':
          resultado.sort((a, b) => b.precio - a.precio);
          break;
        case 'rating-desc':
          resultado.sort((a, b) => b.rating - a.rating);
          break;
        case 'stock-desc':
          resultado.sort((a, b) => b.stock - a.stock);
          break;
      }
      
      return resultado;
    },
    
    mejorProducto() {
      if (this.productosComparar.length === 0) return null;
      return this.productosComparar.reduce((mejor, actual) => 
        this.calcularScore(actual) > this.calcularScore(mejor) ? actual : mejor
      );
    }
  },
  methods: {
    toggleBusqueda() {
      this.mostrarBusqueda = !this.mostrarBusqueda;
      if (this.mostrarBusqueda) {
        this.$nextTick(() => {
          this.$refs.busquedaInput?.focus();
        });
      }
    },
    
    toggleFiltros() {
      this.mostrarFiltros = !this.mostrarFiltros;
    },
    
    limpiarBusqueda() {
      this.busqueda = '';
    },
    
    expandirProducto(producto) {
      this.productoExpandido = producto;
    },
    
    cerrarProducto() {
      this.productoExpandido = null;
    },
    
    verPerfil() {
      this.mostrarModalPerfil = true;
    },
    
    irAPerfil() {
      this.$router.push('/perfil');
    },
    
    salir() {
      this.$router.push('/login');
    },
    
    obtenerProductosAgricultor(agricultorId, productoActualId) {
      return this.productos.filter(p => 
        p.agricultorId === agricultorId && p.id !== productoActualId
      );
    },
    
    toggleComparar(producto) {
      const index = this.productosComparar.findIndex(p => p.id === producto.id);
      if (index > -1) {
        this.productosComparar.splice(index, 1);
      } else {
        if (this.productosComparar.length < 3) {
          this.productosComparar.push(producto);
        } else {
          alert('Solo puedes comparar hasta 3 productos a la vez');
        }
      }
    },
    
    estaEnComparador(productoId) {
      return this.productosComparar.some(p => p.id === productoId);
    },
    
    limpiarComparador() {
      this.productosComparar = [];
    },
    
    abrirComparador() {
      this.mostrarFiltros = true;
      this.tabActiva = 'comparador';
    },
    
    calcularScore(producto) {
      const precioScore = ((20 - producto.precio) / 20) * 40;
      const ratingScore = (producto.rating / 5) * 35;
      const stockScore = Math.min((producto.stock / 50) * 25, 25);
      return Math.round(precioScore + ratingScore + stockScore);
    },
    
    ordenarPor(valor) {
      this.ordenActual = valor;
    },
    
    limpiarFiltros() {
      this.categoriasFiltro = [];
      this.precioMin = 0;
      this.precioMax = 20;
      this.ordenActual = 'ninguno';
    },

    comprarProducto(producto) {
      // Redirigir a la página de compra con los datos del producto
      this.$router.push({
        name: 'Compra',
        params: { 
          productoId: producto.id 
        },
        // Pasar el producto completo como query para tener todos los datos
        query: {
          producto: JSON.stringify(producto)
        }
      });
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

.productos-page {
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

.navbar-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.icon-btn {
  background: #f0f0f0;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: #ff8a3d;
  color: white;
  transform: scale(1.1);
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

.busqueda-container {
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  animation: slideDown 0.3s ease;
}

.busqueda-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f9f9f9;
  padding: 15px 20px;
  border-radius: 30px;
  border: 2px solid #e0e0e0;
}

.busqueda-wrapper:focus-within {
  border-color: #ff8a3d;
  box-shadow: 0 0 0 3px rgba(255, 138, 61, 0.1);
}

.icono-busqueda {
  color: #666;
  flex-shrink: 0;
}

.input-busqueda {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
}

.btn-limpiar {
  background: #ff8a3d;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-limpiar:hover {
  background: #ff6b35;
  transform: rotate(90deg);
}

.sin-resultados, .resultados-info {
  margin-top: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.resultados-info {
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: 600;
}

.contenido {
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.banner-comparador {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.banner-comparador button {
  background: white;
  color: #ff8a3d;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.banner-comparador button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.lista-productos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.producto-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s;
}

.producto-wrapper:hover {
  box-shadow: 0 6px 25px rgba(0,0,0,0.12);
}

.producto-card {
  display: flex;
  align-items: center;
  padding: 25px;
  gap: 20px;
  cursor: pointer;
  position: relative;
}

.checkbox-comparar {
  display: flex;
  align-items: center;
}

.checkbox-comparar input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #ff8a3d;
}

.card-contenido {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-izquierda {
  display: flex;
  gap: 25px;
  align-items: center;
  flex: 1;
}

.card-izquierda img {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.info-basica {
  flex: 1;
}

.descripcion {
  color: #666;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.precio {
  background: linear-gradient(135deg, #ffe0cc 0%, #ffd4b8 100%);
  color: #ff6b35;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
  display: inline-block;
}

.btn-expandir {
  background: #f0f0f0;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s;
  color: #ff8a3d;
}

.btn-expandir:hover {
  background: #ff8a3d;
  color: white;
  transform: scale(1.1);
}

.producto-expandido {
  animation: expandir 0.3s ease;
}

.producto-header {
  background: linear-gradient(to right, #fff8f0, #ffffff);
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 2px solid #f0f0f0;
}

.header-izquierda {
  display: flex;
  gap: 20px;
  align-items: center;
  flex: 1;
}

.img-pequena {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}

.descripcion-corta {
  color: #666;
  font-size: 14px;
  flex: 1;
}

.header-derecha {
  display: flex;
  gap: 20px;
  align-items: center;
}

.btn-colapsar {
  background: #ff8a3d;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  color: white;
  transition: all 0.3s;
}

.btn-colapsar:hover {
  background: #ff6b35;
  transform: scale(1.1);
}

.producto-detalle {
  padding: 30px;
}

.detalle-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 20px;
}

.agricultor-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.agricultor-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff8a3d;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff8f0;
  padding: 10px 20px;
  border-radius: 25px;
}

.estrellas {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.estrella {
  font-size: 24px;
}

.acciones {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-comprar {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-comprar:hover {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 138, 61, 0.3);
}

.disponible {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.descripcion-larga {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.otros-productos-seccion {
  border-top: 2px solid #f0f0f0;
  padding-top: 25px;
}

.otros-productos-seccion h3 {
  color: #333;
  margin-bottom: 8px;
}

.info-agricultor {
  color: #666;
  font-size: 13px;
  margin-bottom: 20px;
  font-style: italic;
}

.otros-productos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.producto-otro {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.producto-otro:hover {
  background: #fff3e0;
  border-color: #ff8a3d;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.2);
}

.producto-otro img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.otro-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.otro-nombre {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.otro-precio {
  color: #ff8a3d;
  font-size: 13px;
  font-weight: bold;
}

.otro-stock {
  font-size: 12px;
  color: #666;
}

.sin-otros {
  text-align: center;
  padding: 30px;
  color: #999;
  font-style: italic;
}

.filtros-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.filtros-contenido {
  background: white;
  border-radius: 25px;
  padding: 35px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  animation: aparecer 0.3s ease;
}

.cerrar-filtros {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f0f0f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cerrar-filtros:hover {
  background: #ff8a3d;
  color: white;
  transform: rotate(90deg);
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
}

.tab {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #999;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab.active {
  color: #ff8a3d;
  border-bottom-color: #ff8a3d;
}

.tab:hover {
  color: #ff6b35;
}

.tab-contenido h3 {
  color: #333;
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 18px;
}

.categorias-filtro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f9f9f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.checkbox-label:hover {
  background: #fff3e0;
  border-color: #ff8a3d;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ff8a3d;
}

.precio-filtro {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.precio-inputs {
  display: flex;
  align-items: center;
  gap: 15px;
}

.precio-inputs input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
}

.precio-inputs input:focus {
  outline: none;
  border-color: #ff8a3d;
}

.precio-info {
  background: #fff3e0;
  padding: 12px 20px;
  border-radius: 10px;
  color: #ff6b35;
  font-weight: 600;
  text-align: center;
}

.ordenar-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion-btn {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  text-align: left;
}

.opcion-btn:hover {
  background: #fff3e0;
  border-color: #ff8a3d;
}

.opcion-btn.active {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
  border-color: #ff6b35;
}

.filtros-acciones {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-limpiar-filtros,
.btn-aplicar {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-limpiar-filtros {
  background: #f0f0f0;
  color: #666;
}

.btn-limpiar-filtros:hover {
  background: #e0e0e0;
}

.btn-aplicar {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
}

.btn-aplicar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.comparador-vacio {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.comparador-vacio p {
  margin: 10px 0;
}

.hint {
  font-size: 13px;
  font-style: italic;
  color: #bbb;
}

.comparador-tabla {
  overflow-x: auto;
}

.comparador-tabla table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.comparador-tabla th,
.comparador-tabla td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.comparador-tabla th {
  background: #f9f9f9;
  font-weight: 600;
  color: #333;
}

.comparador-tabla th img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  margin: 0 auto 10px;
  display: block;
}

.comparador-tabla th span {
  display: block;
  font-size: 13px;
}

.score-row {
  background: #fff3e0;
  font-weight: bold;
  color: #ff6b35;
}

.recomendacion {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.recomendacion h4 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 16px;
}

.mejor-opcion {
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.mejor-opcion img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.mejor-opcion strong {
  display: block;
  color: #2e7d32;
  margin-bottom: 5px;
  font-size: 16px;
}

.mejor-opcion p {
  color: #666;
  font-size: 13px;
}

.btn-limpiar-comparador {
  width: 100%;
  padding: 12px;
  background: #f0f0f0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-limpiar-comparador:hover {
  background: #e0e0e0;
}

.modal-perfil {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.perfil-contenido {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  position: relative;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  animation: aparecer 0.3s ease;
}

.cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f0f0f0;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.cerrar:hover {
  background: #ff8a3d;
  color: white;
  transform: rotate(90deg);
}

.perfil-icono {
  font-size: 80px;
  margin: 20px 0;
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
}

.perfil-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: left;
}

.perfil-info p {
  margin: 10px 0;
  color: #666;
}

.btn-editar, .btn-configuracion {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-editar {
  background: linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%);
  color: white;
}

.btn-configuracion {
  background: #f0f0f0;
  color: #333;
}

.btn-editar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 138, 61, 0.3);
}

.btn-configuracion:hover {
  background: #e0e0e0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
  }
  
  .contenido {
    padding: 20px 15px;
  }
  
  .busqueda-container {
    padding: 15px 20px;
  }
  
  .producto-card {
    flex-direction: column;
    padding: 20px;
  }
  
  .card-izquierda {
    flex-direction: column;
    text-align: center;
  }
  
  .producto-card img {
    width: 100px;
    height: 100px;
  }
  
  .detalle-superior {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .acciones {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-comprar {
    width: 100%;
  }

  .otros-productos {
    grid-template-columns: 1fr;
  }

  .filtros-contenido {
    padding: 25px;
    max-width: 95%;
  }

  .tabs {
    flex-direction: column;
  }

  .comparador-tabla {
    font-size: 12px;
  }

  .ordenar-opciones {
    flex-direction: column;
  }

  .opcion-btn {
    width: 100%;
  }
}
</style>
