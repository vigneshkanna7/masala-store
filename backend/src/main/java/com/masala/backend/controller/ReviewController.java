package com.masala.backend.controller;

import com.masala.backend.dto.ReviewRequest;
import com.masala.backend.dto.ReviewResponse;
import com.masala.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ── POST /api/reviews — submit review (authenticated) ──
    @PostMapping
    public ResponseEntity<ReviewResponse> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReviewRequest request) {

        ReviewResponse response = reviewService.submitReview(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    // ── GET /api/reviews — get all reviews (public) ──
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
}