<template>
  <div class="login-page">
    <div class="imagen">
      <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" alt="Agricultura">
    </div>

    <div class="formulario">
      <div class="caja">
        <div class="logo">🌾</div>
        
        <h2>Iniciar Sesión</h2>

        <div v-if="error" class="error">{{ error }}</div>

        <form @submit.prevent="iniciarSesion">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Correo electrónico"
            required
          >
          
          <input 
            type="password" 
            v-model="password" 
            placeholder="Contraseña"
            required
          >
          
          <button type="submit">Iniciar sesión</button>
        </form>

        <div class="links">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <span> | </span>
          <router-link to="/register">Registrarse</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../services/api'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    iniciarSesion() {
      this.error = ''
      
      // Intentar hacer login
      login(this.email, this.password)
        .then(response => {
          console.log('Login exitoso', response)
          this.$router.push('/productos')
        })
        .catch(error => {
          this.error = 'Error al iniciar sesión'
          console.log(error)
          // Por ahora redirigir igual para probar
          setTimeout(() => {
            this.$router.push('/productos')
          }, 1000)
        })
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
}

.imagen {
  width: 50%;
}

.imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.formulario {
  width: 50%;
  background: linear-gradient(to bottom, #ff8a3d, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.caja {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 400px;
}

.logo {
  text-align: center;
  font-size: 50px;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.error {
  background: #ffcccc;
  color: red;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #ff8a3d, #ff6b35);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.links {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.links a {
  color: #ff8a3d;
  text-decoration: none;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  
  .imagen, .formulario {
    width: 100%;
  }
  
  .imagen {
    height: 200px;
  }
}
</style>