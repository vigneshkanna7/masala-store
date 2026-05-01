package com.masala.backend.controller;

import com.masala.backend.dto.OrderRequest;
import com.masala.backend.model.Order;
import com.masala.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    
 // ✅ Add this new endpoint for guest orders
    @PostMapping("/place/guest")
    public ResponseEntity<Order> placeGuestOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeGuestOrder(request));
    }
    
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(
            @AuthenticationPrincipal String email,
            @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(email, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/admin/status/{id}")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}