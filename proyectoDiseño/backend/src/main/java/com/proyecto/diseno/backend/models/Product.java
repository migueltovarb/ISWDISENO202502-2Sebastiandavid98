package com.proyecto.diseno.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private String description;
    private Integer quantity;
    private Double price;
    private Integer minStock; // Stock mínimo para alertas
    private String category; // Categoría del producto
    private String supplierId; // ID del proveedor

    public Product() {}

    public Product(String name, String description, Integer quantity, Double price) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.minStock = 10; // Valor por defecto
        this.category = "General";
    }
    
    public Product(String name, String description, Integer quantity, Double price, Integer minStock, String category) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.minStock = minStock;
        this.category = category;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
    
    public Integer getMinStock() {
        return minStock;
    }

    public void setMinStock(Integer minStock) {
        this.minStock = minStock;
    }
    
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }
    
    // Método helper para verificar stock bajo
    public boolean isLowStock() {
        return this.quantity != null && this.minStock != null && this.quantity <= this.minStock;
    }
}
