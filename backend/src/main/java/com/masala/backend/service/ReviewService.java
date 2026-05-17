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
        if (req.getRating() < 1 || req.getRating() > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5.");

        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));

        if (!"DELIVERED".equalsIgnoreCase(order.getStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can only review delivered orders.");

        if (reviewRepository.existsByOrderId(req.getOrderId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reviewed this order.");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order does not belong to you.");

        Review review = new Review();
        review.setUser(user);
        review.setOrder(order);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        review.setReviewerName(user.getName());
        review.setVerified(false); // ✅ starts as unverified

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    // ── Public: only verified reviews shown on UI ──
    public List<ReviewResponse> getVerifiedReviews() {
        return reviewRepository.findByVerifiedTrueOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Admin: all reviews (verified + pending) ──
    public List<ReviewResponse> getAllReviewsForAdmin() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Admin: verify a review ──
    public ReviewResponse verifyReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found."));
        review.setVerified(true);
        return toResponse(reviewRepository.save(review));
    }

    // ── Admin: delete a review ──
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found.");
        reviewRepository.deleteById(id);
    }

    // ── Map to response ──
    private ReviewResponse toResponse(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setReviewerName(review.getReviewerName());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        res.setVerified(review.isVerified()); // ✅ include verified status
        return res;
    }
}