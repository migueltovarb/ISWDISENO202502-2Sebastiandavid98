package com.proyecto.diseno.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.proyecto.diseno.backend.service.SupplierService;
import com.proyecto.diseno.backend.models.Supplier;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    @Autowired 
    private SupplierService service;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Supplier s) {
        try {
            Supplier created = service.create(s);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Supplier> list() { 
        return service.listAll(); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        try {
            Supplier supplier = service.getById(id);
            return ResponseEntity.ok(supplier);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Supplier s) {
        try {
            Supplier updated = service.update(id, s);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Proveedor eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
