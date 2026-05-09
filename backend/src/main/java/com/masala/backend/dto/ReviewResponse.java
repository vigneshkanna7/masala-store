package com.masala.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private String reviewerName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}