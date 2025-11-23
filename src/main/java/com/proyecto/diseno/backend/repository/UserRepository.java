package com.proyecto.diseno.backend.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.proyecto.diseno.backend.models.User;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);
}
