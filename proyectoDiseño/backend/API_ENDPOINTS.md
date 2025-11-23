# API Endpoints - Sistema de Gestión de Inventario

## Base URL
```
http://localhost:8080
```

## 🔐 Autenticación

### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login success"
}
```

**Usuarios de prueba:**
- Admin: `admin@admin.com` / `admin123`
- Usuario: `user@user.com` / `user123`

---

## 📦 Productos

### Listar todos los productos
```http
GET /api/products
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Laptop Dell",
    "description": "Laptop Dell Inspiron 15",
    "quantity": 10,
    "price": 850.00
  }
]
```

### Obtener un producto por ID
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

### Crear un producto
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 5,
  "price": 750.00
}
```

### Actualizar un producto
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop HP Pro",
  "quantity": 8,
  "price": 800.00
}
```

### Eliminar un producto
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

---

## 📊 Transacciones

### Listar todas las transacciones
```http
GET /api/transactions
Authorization: Bearer {token}
```

### Crear una transacción (Entrada/Salida)
```http
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "quantity": 5,
  "type": "IN"
}
```

**Tipos de transacción:**
- `IN`: Entrada de inventario (suma al stock)
- `OUT`: Salida de inventario (resta del stock)

**Nota:** El sistema valida automáticamente que haya stock suficiente para transacciones de tipo `OUT`.

### Listar transacciones por producto
```http
GET /api/transactions/product/{productId}
Authorization: Bearer {token}
```

### Listar transacciones por usuario
```http
GET /api/transactions/user/{userId}
Authorization: Bearer {token}
```

---

## 🔧 Códigos de Estado

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en la solicitud (validación)
- `401 Unauthorized`: Token inválido o no proporcionado
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

---

## 🚀 Cómo probar los endpoints

### Usando cURL:

```bash
# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'

# Listar productos (reemplaza {TOKEN} con el token obtenido)
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer {TOKEN}"
```

### Usando Postman o Thunder Client:

1. Hacer login y copiar el token de la respuesta
2. En las siguientes peticiones, agregar el header:
   - Key: `Authorization`
   - Value: `Bearer {tu_token_aquí}`
