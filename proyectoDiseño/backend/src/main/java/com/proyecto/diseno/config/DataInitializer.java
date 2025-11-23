package com.proyecto.diseno.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.proyecto.diseno.backend.repository.UserRepository;
import com.proyecto.diseno.backend.repository.ProductRepository;
import com.proyecto.diseno.backend.models.User;
import com.proyecto.diseno.backend.models.Product;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository userRepository, 
                          ProductRepository productRepository,
                          PasswordEncoder encoder) {
        return args -> {
            // Crear usuario admin si no existe
            if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
                User admin = new User("Admin", "admin@admin.com", encoder.encode("admin123"), "ADMIN");
                userRepository.save(admin);
                System.out.println("✓ Usuario Admin creado");
            }
            
            // Crear usuario regular si no existe
            if (userRepository.findByEmail("user@user.com").isEmpty()) {
                User user = new User("Usuario", "user@user.com", encoder.encode("user123"), "USER");
                userRepository.save(user);
                System.out.println("✓ Usuario regular creado");
            }
            
            // Crear productos de ejemplo si no existen
            if (productRepository.count() == 0) {
                Product p1 = new Product("Laptop Dell", "Laptop Dell Inspiron 15", 10, 850.00);
                Product p2 = new Product("Mouse Logitech", "Mouse inalámbrico Logitech MX Master", 25, 45.00);
                Product p3 = new Product("Teclado Mecánico", "Teclado mecánico RGB", 15, 120.00);
                Product p4 = new Product("Monitor Samsung", "Monitor Samsung 24 pulgadas", 8, 200.00);
                Product p5 = new Product("Webcam HD", "Webcam Full HD 1080p", 20, 65.00);
                
                productRepository.save(p1);
                productRepository.save(p2);
                productRepository.save(p3);
                productRepository.save(p4);
                productRepository.save(p5);
                
                System.out.println("✓ Productos de ejemplo creados");
            }
            
            System.out.println("=================================");
            System.out.println("Sistema de Inventario iniciado");
            System.out.println("Usuarios: " + userRepository.count());
            System.out.println("Productos: " + productRepository.count());
            System.out.println("=================================");
        };
    }
}

