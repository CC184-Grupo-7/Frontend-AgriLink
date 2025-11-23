# Mi Proyecto Vue - Sistema de Productos Agrícolas

Este es un proyecto Vue 3 mejorado con diseño profesional basado en Figma.

## 🚀 Características

- ✅ Login y Registro con diseño moderno
- ✅ Vista de productos con cards interactivas
- ✅ Diseño responsive (móvil y desktop)
- ✅ Preparado para conectar con backend
- ✅ Código limpio y fácil de entender
- ✅ Servicio API separado para fácil integración

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run serve

# Compilar para producción
npm run build
```

## 🔌 Conectar con Backend

El proyecto está preparado para conectarse fácilmente con un backend. Solo necesitas:

### 1. Configurar la URL del backend

Abre el archivo `src/services/api.js` y cambia la línea:

```javascript
const API_URL = 'http://localhost:3000/api'; // ← Cambia esto a la URL de tu backend
```

### 2. Endpoints esperados del backend

El proyecto espera que el backend tenga estos endpoints:

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "usuario@example.com",
    "password": "contraseña123"
  }
  ```
  Respuesta esperada:
  ```json
  {
    "token": "jwt_token_aqui",
    "user": {
      "id": 1,
      "email": "usuario@example.com"
    }
  }
  ```

- `POST /api/auth/register` - Registrar usuario
  ```json
  {
    "email": "nuevo@example.com",
    "password": "contraseña123"
  }
  ```

#### Productos
- `GET /api/productos` - Obtener todos los productos
  ```json
  [
    {
      "id": 1,
      "nombre": "Papas frescas",
      "descripcion": "Descripción del producto",
      "precio": 7.34,
      "imagen": "url_de_la_imagen"
    }
  ]
  ```

- `GET /api/productos/:id` - Obtener un producto por ID
- `POST /api/productos` - Crear un producto (requiere autenticación)
- `PUT /api/productos/:id` - Actualizar un producto (requiere autenticación)
- `DELETE /api/productos/:id` - Eliminar un producto (requiere autenticación)

### 3. Datos de ejemplo

Mientras no tengas el backend listo, el proyecto usa datos de ejemplo (`mockProducts`) que puedes encontrar en `src/services/api.js`.

## 📁 Estructura del Proyecto

```
src/
├── services/
│   └── api.js          # Servicio para conectar con el backend
├── views/
│   ├── Login.vue       # Vista de login
│   ├── Register.vue    # Vista de registro
│   └── Productos.vue   # Vista de productos
├── router/
│   └── index.js        # Configuración de rutas
├── App.vue             # Componente principal
└── main.js             # Punto de entrada
```

## 🎨 Diseño

El diseño está basado en el mockup de Figma proporcionado con:
- Colores naranjas (#ff8a3d, #ff6b35)
- Cards de productos con efecto hover
- Navbar moderna y responsive
- Formularios estilizados

## 🔧 Personalización

### Cambiar colores
Los colores principales están definidos en los estilos de cada componente. Busca:
- `#ff8a3d` (naranja principal)
- `#ff6b35` (naranja secundario)

### Agregar más productos
Edita el array `mockProducts` en `src/services/api.js`

## 📝 Notas para tu compañero del Backend

1. Los endpoints deben devolver JSON
2. El token JWT se guarda en `localStorage`
3. Para proteger rutas, usa el token en el header:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

## 🐛 Solución de Problemas

**Error: Cannot find module 'vue'**
```bash
npm install
```

**El proyecto no se conecta al backend**
- Verifica que la URL en `api.js` sea correcta
- Asegúrate de que el backend esté corriendo
- Revisa la consola del navegador para ver errores

## 📱 Navegación

- `/` → Redirige a `/login`
- `/login` → Página de inicio de sesión
- `/register` → Página de registro
- `/productos` → Lista de productos

## ✨ Mejoras Futuras

- [ ] Agregar carrito de compras
- [ ] Sistema de búsqueda y filtros
- [ ] Paginación de productos
- [ ] Perfil de usuario
- [ ] Sistema de favoritos
- [ ] Comentarios y valoraciones

---

**¡Listo para usar!** 🎉

Si tienes dudas, revisa el código - está comentado y es fácil de entender.
