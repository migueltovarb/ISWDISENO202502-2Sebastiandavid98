package com.proyecto.diseno.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.proyecto.diseno.backend.models.Supplier;
import java.util.Optional;

public interface SupplierRepository extends MongoRepository<Supplier, String> {
    Optional<Supplier> findByEmail(String email);
}
