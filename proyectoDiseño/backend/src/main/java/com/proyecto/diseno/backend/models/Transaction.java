package com.proyecto.diseno.backend.models;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String productId;
    private String userId;
    private Integer quantity;
    private LocalDateTime date;
    private String type; // "IN" or "OUT"

    public Transaction() {}
    
    public Transaction(String productId, String userId, Integer quantity, LocalDateTime date, String type) {
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.date = date;
        this.type = type;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
