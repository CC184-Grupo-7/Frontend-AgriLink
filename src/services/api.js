const API_URL = 'https://backend-agrilink.onrender.com/api'

// Funcion para hacer login
export function login(email, password) {
  return fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .catch(error => {
    console.log('Error:', error)
    throw error
  })
}

// Funcion para registrar
export function register(email, password) {
  return fetch(API_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .catch(error => {
    console.log('Error:', error)
    throw error
  })
}

// Funcion para obtener productos
export function getProductos() {
  return fetch(API_URL + '/productos')
    .then(response => response.json())
    .catch(error => {
      console.log('Error:', error)
      return productosEjemplo
    })
}

// Productos de ejemplo a la espera de backend
export const productosEjemplo = [
  {
    id: 1,
    nombre: 'Papas frescas',
    descripcion: 'Papas de buena calidad',
    precio: 7.50,
    imagen: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200'
  },
  {
    id: 2,
    nombre: 'Mangos',
    descripcion: 'Mangos dulces',
    precio: 5.00,
    imagen: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200'
  },
  {
    id: 3,
    nombre: 'Manzanas',
    descripcion: 'Manzanas rojas',
    precio: 6.00,
    imagen: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200'
  }
]
