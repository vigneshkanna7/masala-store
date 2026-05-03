// ─────────────────────────────────────────────────────────────────────────────
// FILE 1: src/main/java/com/masala/backend/controller/PasswordResetController.java
// ─────────────────────────────────────────────────────────────────────────────
package com.masala.backend.controller;

import com.masala.backend.repository.UserRepository;
import com.masala.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    // In-memory OTP store: email -> {otp, expiry}
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    // ── Step 1: Send OTP ──────────────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (!userRepository.findByEmail(email).isPresent()) {
            // Don't reveal if email exists or not (security best practice)
            return ResponseEntity.ok(Map.of("message", "If this email exists, an OTP has been sent."));
        }

        // Generate 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        otpStore.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));

        // Send email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Masala Store - Password Reset OTP");
            message.setText(
                "Hello,\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "- Masala Store Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace(); // ← shows exact error in console
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send email. Try again."));
        }

        return ResponseEntity.ok(Map.of("message", "If this email exists, an OTP has been sent."));
    }

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp   = body.get("otp");

        OtpEntry entry = otpStore.get(email);

        if (entry == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "No OTP requested for this email."));
        }
        if (LocalDateTime.now().isAfter(entry.expiry())) {
            otpStore.remove(email);
            return ResponseEntity.badRequest().body(Map.of("message", "OTP has expired. Please request a new one."));
        }
        if (!entry.otp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP. Please try again."));
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified successfully."));
    }

    // ── Step 3: Reset Password ────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email       = body.get("email");
        String otp         = body.get("otp");
        String newPassword = body.get("newPassword");

        OtpEntry entry = otpStore.get(email);

        if (entry == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "No OTP requested for this email."));
        }
        if (LocalDateTime.now().isAfter(entry.expiry())) {
            otpStore.remove(email);
            return ResponseEntity.badRequest().body(Map.of("message", "OTP has expired. Please request a new one."));
        }
        if (!entry.otp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP."));
        }

        // Update password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove OTP after successful reset
        otpStore.remove(email);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
    }

    // ── OTP Entry record ──────────────────────────────────────────────────────
    private record OtpEntry(String otp, LocalDateTime expiry) {}
    
    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("kannavignesh19@gmail.com");
            message.setSubject("Test Email from Masala Store");
            message.setText("If you receive this, email is working!");
            mailSender.send(message);
            return ResponseEntity.ok(Map.of("message", "Email sent successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}