package com.proyecto.diseno.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.proyecto.diseno.backend.models.AuditLog;
import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
    List<AuditLog> findByResourceOrderByTimestampDesc(String resource);
    List<AuditLog> findAllByOrderByTimestampDesc();
}
