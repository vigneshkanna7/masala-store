package com.masala.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            String url = "https://api.brevo.com/v3/smtp/email";
            String body = """
                {
                    "sender": {"name": "Masala Store", "email": "vigneshkannabs@gmail.com"},
                    "to": [{"email": "%s"}],
                    "subject": "Your Password Reset OTP",
                    "textContent": "Your OTP is: %s\\n\\nThis OTP expires in 5 minutes."
                }
                """.formatted(toEmail, otp);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("api-key", brevoApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 201) {
                throw new RuntimeException("Brevo API error: " + response.body());
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}