<template>
  <div class="register-page">
    <div class="imagen">
      <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" alt="Agricultura">
    </div>

    <div class="formulario">
      <div class="caja">
        <div class="logo">🌾</div>
        
        <h2>Registrarse</h2>

        <div v-if="error" class="error">{{ error }}</div>

        <form @submit.prevent="registrarUsuario">
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
          
          <button type="submit">Registrarse</button>
        </form>

        <div class="links">
          <router-link to="/login">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '../services/api'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    registrarUsuario() {
      this.error = ''
      
      register(this.email, this.password)
        .then(response => {
          console.log('Registro exitoso', response)
          this.$router.push('/productos')
        })
        .catch(error => {
          this.error = 'Error al registrarse'
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
.register-page {
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
  .register-page {
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