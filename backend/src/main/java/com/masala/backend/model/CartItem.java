package com.masala.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cart_seq")
    @SequenceGenerator(name = "cart_seq", sequenceName = "cart_seq", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)  // ✅ nullable for guest orders
    @JsonIgnoreProperties({"password", "role", "phone", "address"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties("items")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column
    private String weight;

    @Column(nullable = false)
    private Double price;
}