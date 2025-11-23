# Script de prueba para API del Sistema de Inventario
# Ejecutar: .\test-api.ps1

$baseUrl = "http://localhost:8080"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Probando API de Inventario" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Login
Write-Host "1. Login con usuario admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@admin.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✓ Login exitoso" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Error en login: $_" -ForegroundColor Red
    exit
}

# 2. Listar productos
Write-Host "2. Listando productos..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get -Headers $headers
    Write-Host "✓ Productos encontrados: $($products.Count)" -ForegroundColor Green
    $products | ForEach-Object {
        Write-Host "  - $($_.name): $($_.quantity) unidades a `$$($_.price)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "✗ Error listando productos: $_" -ForegroundColor Red
}

# 3. Crear un producto
Write-Host "3. Creando nuevo producto..." -ForegroundColor Yellow
$newProduct = @{
    name = "Producto de Prueba"
    description = "Creado desde script de prueba"
    quantity = 100
    price = 99.99
} | ConvertTo-Json

try {
    $createdProduct = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Post -Body $newProduct -ContentType "application/json" -Headers $headers
    Write-Host "✓ Producto creado con ID: $($createdProduct.id)" -ForegroundColor Green
    $productId = $createdProduct.id
    Write-Host ""
} catch {
    Write-Host "✗ Error creando producto: $_" -ForegroundColor Red
}

# 4. Listar transacciones
Write-Host "4. Listando transacciones..." -ForegroundColor Yellow
try {
    $transactions = Invoke-RestMethod -Uri "$baseUrl/api/transactions" -Method Get -Headers $headers
    Write-Host "✓ Transacciones encontradas: $($transactions.Count)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Error listando transacciones: $_" -ForegroundColor Red
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Pruebas completadas" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
