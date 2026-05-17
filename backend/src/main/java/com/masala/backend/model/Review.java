package com.masala.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "review_seq")
    @SequenceGenerator(name = "review_seq", sequenceName = "review_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false, length = 1000)
    private String comment;

    private String reviewerName;

    private LocalDateTime createdAt;

    // ✅ NEW — admin must verify before showing on UI
    @Column(nullable = false)
    private boolean verified = false;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        verified = false; // always starts unverified
    }
}