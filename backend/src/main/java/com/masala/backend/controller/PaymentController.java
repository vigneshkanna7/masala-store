package com.masala.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // POST /api/payment/create-order
    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> body) throws Exception {
        int amount = (int) body.get("amount"); // in ₹

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // paise
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = client.orders.create(options);
        return Map.of("orderId", order.get("id"), "amount", order.get("amount"));
    }

    // POST /api/payment/verify
    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> body) throws Exception {
        String orderId = body.get("razorpay_order_id");
        String paymentId = body.get("razorpay_payment_id");
        String signature = body.get("razorpay_signature");

        String data = orderId + "|" + paymentId;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes());

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) hexString.append(String.format("%02x", b));

        boolean isValid = hexString.toString().equals(signature);
        return Map.of("success", isValid);
    }
}