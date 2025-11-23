import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Productos from '../views/Productos.vue'
import Perfil from '../views/Perfil.vue'
import PerfilComprador from '../views/PerfilComprador.vue'
import Compra from '../views/Compra.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/productos',
    name: 'Productos',
    component: Productos
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil
  },
  {
    path: '/perfil-comprador',
    name: 'PerfilComprador',
    component: PerfilComprador
  },
  {
    path: '/compra/:productoId?',
    name: 'Compra',
    component: Compra
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router