package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.AuditLogRepository;
import com.proyecto.diseno.backend.models.AuditLog;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired 
    private AuditLogRepository repo;

    public void log(String userId, String userName, String action, String resource, String resourceId, String details) {
        AuditLog log = new AuditLog(userId, userName, action, resource, resourceId, details);
        repo.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repo.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByUser(String userId) {
        return repo.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AuditLog> getLogsByAction(String action) {
        return repo.findByActionOrderByTimestampDesc(action);
    }

    public List<AuditLog> getLogsByResource(String resource) {
        return repo.findByResourceOrderByTimestampDesc(resource);
    }
}
