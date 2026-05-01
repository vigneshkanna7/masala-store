package com.masala.backend.service;

import com.masala.backend.model.User;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final UserRepository userRepository;

    public String generateOtp(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return user.getResetOtp() != null
            && user.getResetOtp().equals(otp)
            && user.getOtpExpiry().isAfter(LocalDateTime.now());
    }
}