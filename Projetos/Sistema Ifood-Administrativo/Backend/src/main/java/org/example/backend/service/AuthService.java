package org.example.backend.service;

import java.util.Optional;

import org.example.backend.model.Admin;
import org.example.backend.records.AdminDTO.AuthResponseDTO;
import org.example.backend.records.AdminDTO.LoginAdminDTO;
import org.example.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public Optional<AuthResponseDTO> authenticate(LoginAdminDTO loginDTO) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(loginDTO.username());
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(loginDTO.password(), admin.getPassword())) {
                String token = jwtService.generateToken(admin.getUsername());
                return Optional.of(new AuthResponseDTO(token, admin.getUsername()));
            }
        }
        
        return Optional.empty();
    }

    public void deleteAllAdmins() {
        adminRepository.deleteAll();
    }

    public void saveAdmin(Admin admin) {
        adminRepository.save(admin);
    }
} 