package com.masala.backend.dto;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}