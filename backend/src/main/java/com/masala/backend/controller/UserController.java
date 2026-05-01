package com.masala.backend.controller;

import com.masala.backend.model.User;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Get profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // ✅ Update profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal String email,
            @RequestBody Map<String, String> updates) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("phone")) user.setPhone(updates.get("phone"));
        if (updates.containsKey("address")) user.setAddress(updates.get("address"));

        return ResponseEntity.ok(userRepository.save(user));
    }

    // ✅ Change password
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal String email,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(body.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect!");
        }

        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully!");
    }
}