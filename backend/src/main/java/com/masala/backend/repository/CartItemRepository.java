package com.masala.backend.repository;

import com.masala.backend.model.CartItem;
import com.masala.backend.model.Product;
import com.masala.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser_IdAndOrderIsNull(Long userId);
    Optional<CartItem> findByUserAndProductAndOrderIsNull(User user, Product product);
    void deleteByUser_IdAndOrderIsNull(Long userId);
}
