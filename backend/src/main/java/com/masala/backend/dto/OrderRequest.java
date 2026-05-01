package com.masala.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class OrderRequest {
    private String paymentMethod;
    private String shippingAddress;

    // ✅ Guest fields
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    // ✅ Cart items from frontend (for guest orders)
    private List<Map<String, Object>> cartItems;
}