package com.proyecto.diseno.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.dto.*;
import com.proyecto.diseno.backend.service.AuthService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        String token = authService.register(req);
        return ResponseEntity.ok(new AuthResponse(token, "User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return authService.login(req)
                .map(t -> ResponseEntity.ok(new AuthResponse(t, "Login success")))
                .orElse(ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials")));
    }
}
