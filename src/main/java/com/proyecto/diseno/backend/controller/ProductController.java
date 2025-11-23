package com.proyecto.diseno.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.proyecto.diseno.backend.service.ProductService;
import com.proyecto.diseno.backend.models.Product;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired private ProductService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product p) {
        try {
            Product created = service.create(p);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Product> list() { 
        return service.listAll(); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        try {
            Product product = service.getById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Product p) {
        try {
            Product updated = service.update(id, p);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
