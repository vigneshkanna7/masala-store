package com.masala.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnoreProperties({"password", "role", "phone", "address"})
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("order")
    private List<CartItem> items;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String paymentMethod;

    private String paymentStatus;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private String guestName;
    private String guestEmail;
    private String guestPhone;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}