package com.masala.backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long orderId;
    private int rating;   // 1–5
    private String comment;
}