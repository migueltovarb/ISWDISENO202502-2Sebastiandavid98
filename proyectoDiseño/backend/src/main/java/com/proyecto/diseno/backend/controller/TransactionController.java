package com.proyecto.diseno.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.proyecto.diseno.backend.service.TransactionService;
import com.proyecto.diseno.backend.models.Transaction;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    @Autowired private TransactionService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Transaction t) {
        try {
            Transaction created = service.create(t);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Transaction> list() { 
        return service.listAll(); 
    }
    
    @GetMapping("/product/{productId}")
    public List<Transaction> listByProduct(@PathVariable String productId) {
        return service.findByProductId(productId);
    }
    
    @GetMapping("/user/{userId}")
    public List<Transaction> listByUser(@PathVariable String userId) {
        return service.findByUserId(userId);
    }
}
