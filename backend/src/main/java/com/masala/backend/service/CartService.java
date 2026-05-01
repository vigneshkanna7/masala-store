package com.masala.backend.service;

import com.masala.backend.dto.CartRequest;
import com.masala.backend.model.CartItem;
import com.masala.backend.model.Product;
import com.masala.backend.model.User;
import com.masala.backend.repository.CartItemRepository;
import com.masala.backend.repository.ProductRepository;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartItem addToCart(String email, CartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found!"));

        Optional<CartItem> existing = cartItemRepository.findByUserAndProductAndOrderIsNull(user, product);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setPrice(product.getPrice() * item.getQuantity());
            return cartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setWeight(request.getWeight()); // ✅ NEW
        cartItem.setPrice(calculatePrice(product.getPrice(), request.getWeight())); // ✅ NEW
        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getUserCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return cartItemRepository.findByUser_IdAndOrderIsNull(user.getId());
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        cartItemRepository.deleteByUser_IdAndOrderIsNull(userId);
    }
    
    public CartItem updateQuantity(Long cartItemId, int quantity, String weight) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found!"));

        if (quantity <= 0) {
            cartItemRepository.deleteById(cartItemId);
            return null;
        }

        item.setQuantity(quantity);
        item.setWeight(weight);
        item.setPrice(calculatePrice(item.getProduct().getPrice(), weight) * quantity);
        return cartItemRepository.save(item);
    }
    
    private Double calculatePrice(Double basePrice, String weight) {
        if (weight == null) return basePrice;
        switch (weight) {
            case "250g": return basePrice * 0.25;
            case "500g": return basePrice * 0.50;
            case "750g": return basePrice * 0.75;
            case "1kg":  return basePrice * 1.0;
            default:     return basePrice;
        }
    }
}
