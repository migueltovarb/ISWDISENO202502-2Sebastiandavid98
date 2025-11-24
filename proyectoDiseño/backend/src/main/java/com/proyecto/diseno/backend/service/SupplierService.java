package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.SupplierRepository;
import com.proyecto.diseno.backend.models.Supplier;
import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {
    @Autowired 
    private SupplierRepository repo;

    public Supplier create(Supplier s) {
        if (s.getName() == null || s.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre del proveedor es requerido");
        }
        if (s.getEmail() == null || s.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El email es requerido");
        }
        
        // Validar email único
        Optional<Supplier> existing = repo.findByEmail(s.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Ya existe un proveedor con ese email");
        }
        
        return repo.save(s);
    }
    
    public List<Supplier> listAll() { 
        return repo.findAll(); 
    }
    
    public Supplier getById(String id) { 
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }
    
    public Supplier update(String id, Supplier s) {
        Supplier existing = getById(id);
        
        if (s.getName() != null) existing.setName(s.getName());
        if (s.getContact() != null) existing.setContact(s.getContact());
        if (s.getPhone() != null) existing.setPhone(s.getPhone());
        if (s.getAddress() != null) existing.setAddress(s.getAddress());
        
        // Si cambia el email, validar que sea único
        if (s.getEmail() != null && !s.getEmail().equals(existing.getEmail())) {
            Optional<Supplier> emailExists = repo.findByEmail(s.getEmail());
            if (emailExists.isPresent()) {
                throw new RuntimeException("Ya existe un proveedor con ese email");
            }
            existing.setEmail(s.getEmail());
        }
        
        return repo.save(existing);
    }
    
    public void delete(String id) { 
        getById(id); // Verifica que existe
        repo.deleteById(id); 
    }
}
