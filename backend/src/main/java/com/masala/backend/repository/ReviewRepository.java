package com.masala.backend.repository;
import com.masala.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // ✅ Public — only verified reviews (for UI display)
    List<Review> findByVerifiedTrueOrderByCreatedAtDesc();

    // ✅ Admin — all reviews regardless of verified status
    List<Review> findAllByOrderByCreatedAtDesc();

    // ✅ Check duplicate review per order
    boolean existsByOrderId(Long orderId);
}