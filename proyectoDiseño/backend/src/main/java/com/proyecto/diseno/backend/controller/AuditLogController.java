package com.proyecto.diseno.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.service.AuditLogService;
import com.proyecto.diseno.backend.models.AuditLog;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditLogController {
    @Autowired 
    private AuditLogService service;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return service.getAllLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLog> getLogsByUser(@PathVariable String userId) {
        return service.getLogsByUser(userId);
    }

    @GetMapping("/action/{action}")
    public List<AuditLog> getLogsByAction(@PathVariable String action) {
        return service.getLogsByAction(action);
    }

    @GetMapping("/resource/{resource}")
    public List<AuditLog> getLogsByResource(@PathVariable String resource) {
        return service.getLogsByResource(resource);
    }
}
