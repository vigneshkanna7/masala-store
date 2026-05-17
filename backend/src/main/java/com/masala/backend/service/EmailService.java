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

    // ── Existing: OTP email ──────────────────────────────────────────────────
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

            sendBrevoRequest(url, body);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    // ── NEW: Review request email after delivery ─────────────────────────────
    public void sendReviewRequestEmail(String toEmail, String customerName, Long orderId) {
        try {
            // Deep-link to the Orders section on ProfilePage with orderId highlighted
            // Format: http://localhost:3000/profile?tab=orders&reviewOrderId=123
            String reviewUrl = "http://localhost:3000/orders?reviewOrderId=" + orderId;

            String htmlContent = buildReviewEmailHtml(customerName, orderId, reviewUrl);

            String escapedHtml = htmlContent
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "");

            String url = "https://api.brevo.com/v3/smtp/email";
            String body = """
                {
                    "sender": {"name": "Masala Store", "email": "vigneshkannabs@gmail.com"},
                    "to": [{"email": "%s", "name": "%s"}],
                    "subject": "How was your order? Share your review 🌶️",
                    "htmlContent": "%s"
                }
                """.formatted(toEmail, customerName, escapedHtml);

            sendBrevoRequest(url, body);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send review request email: " + e.getMessage());
        }
    }

    // ── Shared HTTP helper ───────────────────────────────────────────────────
    private void sendBrevoRequest(String url, String body) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("api-key", brevoApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) {
            throw new RuntimeException("Brevo API error: " + response.body());
        }
    }

    // ── HTML template for review email ───────────────────────────────────────
    private String buildReviewEmailHtml(String customerName, Long orderId, String reviewUrl) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:'DM Sans',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0"
                      style="background:#ffffff;border-radius:16px;overflow:hidden;
                             box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:90%%;">

                      <!-- Header -->
                      <tr>
                        <td style="background:#c0392b;padding:32px 40px;text-align:center;">
                          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;
                                     letter-spacing:0.06em;text-transform:uppercase;">
                            🌶️ Masala Store
                          </h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                            Authentic spices delivered to your door
                          </p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:40px 40px 32px;">
                          <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111;">
                            Your order has been delivered! 🎉
                          </h2>
                          <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.6;">
                            Hi <strong>%s</strong>,<br/><br/>
                            We hope your <strong>Order #%d</strong> arrived in perfect condition and
                            you're enjoying your spices! Your feedback means the world to us and
                            helps other customers make great choices.
                          </p>

                          <!-- Star rating visual (decorative) -->
                          <div style="text-align:center;margin-bottom:28px;">
                            <span style="font-size:32px;letter-spacing:4px;">⭐⭐⭐⭐⭐</span>
                            <p style="margin:10px 0 0;font-size:14px;color:#777;">
                              How would you rate your experience?
                            </p>
                          </div>

                          <!-- CTA Button -->
                          <div style="text-align:center;margin-bottom:32px;">
                            <a href="%s"
                               style="display:inline-block;background:#c0392b;color:#ffffff;
                                      text-decoration:none;padding:16px 48px;border-radius:8px;
                                      font-size:16px;font-weight:700;letter-spacing:0.03em;
                                      box-shadow:0 4px 12px rgba(192,57,43,0.35);">
                              ✍️ Write a Review
                            </a>
                          </div>

                          <!-- Small note -->
                          <p style="margin:0;font-size:13px;color:#999;text-align:center;line-height:1.5;">
                            Takes less than a minute • Your review helps us improve<br/>
                            <a href="%s" style="color:#c0392b;text-decoration:none;">
                              Click here if the button doesn't work
                            </a>
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding:0 40px;">
                          <hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"/>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:24px 40px;text-align:center;">
                          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
                            You received this email because you placed an order with Masala Store.<br/>
                            © 2025 Masala Store. All rights reserved.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
        """.formatted(customerName, orderId, reviewUrl, reviewUrl);
    }
}