package com.masala.backend.controller;

import com.masala.backend.model.Order;
import com.masala.backend.model.Product;
import com.masala.backend.model.User;
import com.masala.backend.repository.OrderRepository;
import com.masala.backend.repository.ProductRepository;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updated) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setStock(updated.getStock());
        product.setCategory(updated.getCategory());
        product.setImageUrl(updated.getImageUrl());
        product.setIngredients(updated.getIngredients());
        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted!");
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}