package com.masala.backend.dto;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private Integer quantity;
    private String weight; // ✅ NEW — "250g", "500g", "750g", "1kg"
}