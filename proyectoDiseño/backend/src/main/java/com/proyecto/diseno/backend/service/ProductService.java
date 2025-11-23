package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.ProductRepository;
import com.proyecto.diseno.backend.models.Product;
import java.util.List;

@Service
public class ProductService {
    @Autowired private ProductRepository repo;

    public Product create(Product p) {
        if (p.getName() == null || p.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre del producto es requerido");
        }
        if (p.getQuantity() == null || p.getQuantity() < 0) {
            throw new RuntimeException("La cantidad debe ser mayor o igual a 0");
        }
        if (p.getPrice() == null || p.getPrice() < 0) {
            throw new RuntimeException("El precio debe ser mayor o igual a 0");
        }
        return repo.save(p);
    }
    
    public List<Product> listAll() { 
        return repo.findAll(); 
    }
    
    public Product getById(String id) { 
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    
    public Product update(String id, Product p) {
        Product existing = getById(id);
        if (p.getName() != null) existing.setName(p.getName());
        if (p.getDescription() != null) existing.setDescription(p.getDescription());
        if (p.getQuantity() != null) existing.setQuantity(p.getQuantity());
        if (p.getPrice() != null) existing.setPrice(p.getPrice());
        return repo.save(existing);
    }
    
    public void delete(String id) { 
        getById(id); // Verifica que existe
        repo.deleteById(id); 
    }
}
