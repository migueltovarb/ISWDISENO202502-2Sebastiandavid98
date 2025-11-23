# 🚀 Inicio Rápido - Sistema de Inventario

## ⚡ Ejecutar el Backend en 3 pasos

### 1️⃣ Compilar
```bash
./mvnw clean package -DskipTests
```

### 2️⃣ Ejecutar
```bash
./mvnw spring-boot:run
```

### 3️⃣ Verificar
Abre tu navegador en: `http://localhost:8080`

---

## 🧪 Probar la API

### Opción 1: Script PowerShell (Recomendado)
```powershell
.\test-api.ps1
```

### Opción 2: cURL

#### Login
```bash
curl -X POST http://localhost:8080/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@admin.com\",\"password\":\"admin123\"}"
```

#### Listar Productos (reemplaza TOKEN)
```bash
curl -X GET http://localhost:8080/api/products ^
  -H "Authorization: Bearer TOKEN"
```

### Opción 3: Postman/Thunder Client

1. **Login**
   - POST `http://localhost:8080/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@admin.com",
       "password": "admin123"
     }
     ```
   - Copiar el `token` de la respuesta

2. **Listar Productos**
   - GET `http://localhost:8080/api/products`
   - Header: `Authorization: Bearer {tu_token}`

---

## 👤 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@admin.com | admin123 | ADMIN |
| user@user.com | user123 | USER |

---

## 📚 Documentación Completa

- **API Endpoints**: Ver `API_ENDPOINTS.md`
- **Estado del Proyecto**: Ver `ESTADO_PROYECTO.md`
- **Resumen Completo**: Ver `RESUMEN_COMPLETO.md`

---

## ❓ Problemas Comunes

### El servidor no inicia
- Verifica que el puerto 8080 esté libre
- Revisa la conexión a MongoDB en `application.properties`

### Error de autenticación
- Asegúrate de incluir el header `Authorization: Bearer {token}`
- Verifica que el token no haya expirado (24 horas)

### No se cargan los datos de prueba
- Elimina las colecciones en MongoDB Atlas
- Reinicia el servidor

---

## 🎯 Próximos Pasos

1. ✅ Probar todos los endpoints
2. ⏳ Integrar frontend React
3. ⏳ Crear diagramas UML
4. ⏳ Agregar tests
5. ⏳ Deploy a producción
