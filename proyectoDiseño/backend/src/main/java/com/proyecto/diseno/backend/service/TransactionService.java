package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.TransactionRepository;
import com.proyecto.diseno.backend.repository.ProductRepository;
import com.proyecto.diseno.backend.models.Transaction;
import com.proyecto.diseno.backend.models.Product;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private ProductRepository productRepo;
    
    public Transaction create(Transaction t) {
        // Validar que el producto existe
        Product product = productRepo.findById(t.getProductId())
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        // Actualizar inventario según el tipo de transacción
        if ("OUT".equals(t.getType())) {
            if (product.getQuantity() < t.getQuantity()) {
                throw new RuntimeException("Stock insuficiente");
            }
            product.setQuantity(product.getQuantity() - t.getQuantity());
        } else if ("IN".equals(t.getType())) {
            product.setQuantity(product.getQuantity() + t.getQuantity());
        }
        
        productRepo.save(product);
        t.setDate(LocalDateTime.now());
        return transactionRepo.save(t);
    }
    
    public List<Transaction> listAll() { 
        return transactionRepo.findAll(); 
    }
    
    public List<Transaction> findByProductId(String productId) {
        return transactionRepo.findByProductId(productId);
    }
    
    public List<Transaction> findByUserId(String userId) {
        return transactionRepo.findByUserId(userId);
    }
}
