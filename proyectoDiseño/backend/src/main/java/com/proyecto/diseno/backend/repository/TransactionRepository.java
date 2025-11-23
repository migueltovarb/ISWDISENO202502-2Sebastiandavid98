package com.proyecto.diseno.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.proyecto.diseno.backend.models.Transaction;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction,String> {
    List<Transaction> findByProductId(String productId);
    List<Transaction> findByUserId(String userId);
}
