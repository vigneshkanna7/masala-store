package com.masala.backend.dto;

import lombok.Data;

@Data
public class CartItemResponse {
    private Long id;
    private Integer quantity;
    private Double price;
    private String weight;
    private Long productId;
    private String productName;
    private String imageUrl;
}