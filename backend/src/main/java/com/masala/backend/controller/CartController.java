package com.masala.backend.controller;

import com.masala.backend.dto.CartRequest;
import com.masala.backend.model.CartItem;
import com.masala.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,  // ← changed
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userDetails.getUsername(), request));  // ← .getUsername()
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {  // ← changed
        return ResponseEntity.ok(cartService.getUserCart(userDetails.getUsername()));  // ← .getUsername()
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> removeItem(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok("Item removed from cart!");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestParam int quantity,
            @RequestParam(defaultValue = "250g") String weight) {
        CartItem updated = cartService.updateQuantity(id, quantity, weight);
        if (updated == null) return ResponseEntity.ok("Item removed");
        return ResponseEntity.ok(updated);
    }
}