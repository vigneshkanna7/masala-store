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

    // ── POST /api/reviews — submit review (authenticated user) ──
    @PostMapping
    public ResponseEntity<ReviewResponse> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.submitReview(userDetails.getUsername(), request));
    }

    // ── GET /api/reviews — public: only verified reviews for UI ──
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getVerifiedReviews() {
        return ResponseEntity.ok(reviewService.getVerifiedReviews());
    }

    // ── GET /api/reviews/admin/all — admin: all reviews (pending + verified) ──
    @GetMapping("/admin/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(reviewService.getAllReviewsForAdmin());
    }

    // ── PUT /api/reviews/admin/verify/{id} — admin: verify a review ──
    @PutMapping("/admin/verify/{id}")
    public ResponseEntity<ReviewResponse> verifyReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.verifyReview(id));
    }

    // ── DELETE /api/reviews/admin/{id} — admin: delete a review ──
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}