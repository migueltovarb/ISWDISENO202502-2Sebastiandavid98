package com.proyecto.diseno.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.proyecto.diseno.backend.models.Product;

public interface ProductRepository extends MongoRepository<Product,String> {}
