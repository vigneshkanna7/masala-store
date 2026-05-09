package com.masala.backend.service;

import com.masala.backend.dto.ReviewRequest;
import com.masala.backend.dto.ReviewResponse;
import com.masala.backend.model.Order;
import com.masala.backend.model.Review;
import com.masala.backend.model.User;
import com.masala.backend.repository.OrderRepository;
import com.masala.backend.repository.ReviewRepository;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // ── Submit a review (logged-in user) ──
    public ReviewResponse submitReview(String email, ReviewRequest req) {

        // Validate rating
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5.");
        }

        // Fetch order
        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));

        // Only DELIVERED orders can be reviewed
        if (!"DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can only review delivered orders.");
        }

        // Prevent duplicate review for same order
        if (reviewRepository.existsByOrderId(req.getOrderId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this order.");
        }

        // Fetch user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        // Verify order belongs to this user
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order does not belong to you.");
        }

        // Save review
        Review review = new Review();
        review.setUser(user);
        review.setOrder(order);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setReviewerName(user.getName());

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    // ── Get all reviews (public — for homepage / product page) ──
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Map to response ──
    private ReviewResponse toResponse(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setReviewerName(review.getReviewerName());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }
}