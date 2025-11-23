package com.proyecto.diseno.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.proyecto.diseno.backend.repository.UserRepository;
import com.proyecto.diseno.backend.models.User;
import com.proyecto.diseno.backend.dto.RegisterRequest;
import com.proyecto.diseno.backend.dto.LoginRequest;
import com.proyecto.diseno.config.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public String register(RegisterRequest r) {
        if (userRepository.findByEmail(r.getEmail()).isPresent()) throw new RuntimeException("Email exists");
        User u = new User(r.getName(), r.getEmail(), passwordEncoder.encode(r.getPassword()), "USER");
        userRepository.save(u);
        return jwtUtil.generateToken(u.getEmail());
    }

    public Optional<String> login(LoginRequest r) {
        Optional<User> u = userRepository.findByEmail(r.getEmail());
        if (u.isPresent() && passwordEncoder.matches(r.getPassword(), u.get().getPassword())) {
            return Optional.of(jwtUtil.generateToken(u.get().getEmail()));
        }
        return Optional.empty();
    }
}
