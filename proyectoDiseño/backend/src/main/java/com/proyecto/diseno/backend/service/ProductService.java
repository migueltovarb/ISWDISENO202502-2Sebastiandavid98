package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.ProductRepository;
import com.proyecto.diseno.backend.models.Product;
import java.util.List;

@Service
public class ProductService {
    @Autowired private ProductRepository repo;
    @Autowired private AuditLogService auditService;

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
        Product saved = repo.save(p);
        auditService.log("system", "System", "CREATE", "PRODUCT", saved.getId(), "Producto creado: " + saved.getName());
        return saved;
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
        Product updated = repo.save(existing);
        auditService.log("system", "System", "UPDATE", "PRODUCT", id, "Producto actualizado: " + updated.getName());
        return updated;
    }
    
    public void delete(String id) { 
        Product product = getById(id); // Verifica que existe
        auditService.log("system", "System", "DELETE", "PRODUCT", id, "Producto eliminado: " + product.getName());
        repo.deleteById(id); 
    }
}
