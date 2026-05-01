package com.masala.backend.service;

import com.masala.backend.dto.AuthResponse;
import com.masala.backend.dto.LoginRequest;
import com.masala.backend.dto.RegisterRequest;
import com.masala.backend.model.User;
import com.masala.backend.repository.UserRepository;
import com.masala.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole("USER");
        userRepository.save(user);

        // ✅ Link guest orders by phone number after registration
        if (request.getPhone() != null) {
            orderService.linkGuestOrdersToUser(request.getPhone(), user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        
        System.out.println(">>> Found user: " + user.getEmail() + " | role: " + user.getRole());
        System.out.println(">>> Password match: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
    public String resetAdminPassword() {
        User user = userRepository.findByEmail("muthu@gmail.com")
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode("Masala@123"));
        userRepository.save(user);
        return "Password reset successfully!";
    }
}