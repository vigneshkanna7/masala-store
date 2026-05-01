package com.masala.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.masala.backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(Long userId);
    // ✅ NEW
    List<Order> findByGuestPhoneAndUserIsNull(String guestPhone);
}