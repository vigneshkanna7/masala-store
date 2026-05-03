package com.masala.backend.controller;

import com.masala.backend.repository.UserRepository;
import com.masala.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        log.info("Forgot password request for email: {}", email);

        if (!userRepository.findByEmail(email).isPresent()) {
            log.warn("Email not found in DB: {}", email);
            return ResponseEntity.ok(Map.of("message", "If this email exists, an OTP has been sent."));
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        otpStore.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));
        log.info("OTP generated for: {}", email);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setFrom("vigneshkannabs@gmail.com");
            message.setSubject("Masala Store - Password Reset OTP");
            message.setText(
                "Hello,\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "- Masala Store Team"
            );
            log.info("Attempting to send OTP email to: {}", email);
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send email. Try again."));
        }

        return ResponseEntity.ok(Map.of("message", "If this email exists, an OTP has been sent."));
    }

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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpStore.remove(email);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully!"));
    }

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail() {
        log.info("Test email endpoint called");
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("kannavignesh19@gmail.com");
            message.setFrom("vigneshkannabs@gmail.com");
            message.setSubject("Test Email from Masala Store");
            message.setText("If you receive this, email is working!");
            mailSender.send(message);
            log.info("Test email sent successfully!");
            return ResponseEntity.ok(Map.of("message", "Email sent successfully!"));
        } catch (Exception e) {
            log.error("Test email failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private record OtpEntry(String otp, LocalDateTime expiry) {}
}