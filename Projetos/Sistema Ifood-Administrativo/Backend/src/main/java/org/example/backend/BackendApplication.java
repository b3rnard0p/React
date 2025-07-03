package org.example.backend;

import org.example.backend.model.Admin;
import org.example.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @PostConstruct
    public void initAdmin() {
        String defaultUsername = "admin";
        if (adminRepository.findByUsername(defaultUsername).isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername(defaultUsername);
            admin.setPassword(passwordEncoder.encode("admin")); // ou sua senha padrão
            admin.setRole("ROLE_ADMIN");
            adminRepository.save(admin);
        }
    }

}
