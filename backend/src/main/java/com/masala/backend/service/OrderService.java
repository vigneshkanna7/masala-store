package com.masala.backend.service;

import com.masala.backend.dto.OrderRequest;
import com.masala.backend.model.CartItem;
import com.masala.backend.model.Order;
import com.masala.backend.model.Product;
import com.masala.backend.model.User;
import com.masala.backend.repository.CartItemRepository;
import com.masala.backend.repository.OrderRepository;
import com.masala.backend.repository.ProductRepository;
import com.masala.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // ✅ Guest order — cart items come from frontend
    public Order placeGuestOrder(OrderRequest request) {
        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        Order order = new Order();
        order.setGuestName(request.getGuestName());
        order.setGuestEmail(request.getGuestEmail());
        order.setGuestPhone(request.getGuestPhone());
        order.setStatus("PLACED");
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentMethod().equals("COD") ? "UNPAID" : "PAID");
        order.setShippingAddress(request.getShippingAddress());

        // Build cart items from request
        List<CartItem> cartItems = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> itemData : request.getCartItems()) {
            Long productId = Long.valueOf(itemData.get("productId").toString());
            int quantity = Integer.parseInt(itemData.get("quantity").toString());
            double price = Double.parseDouble(itemData.get("price").toString());
            String weight = itemData.get("weight") != null ? itemData.get("weight").toString() : "250g";

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(price);
            item.setWeight(weight);
            item.setOrder(order);
            cartItems.add(item);
            total += price;
        }

        order.setTotalAmount(total);
        order.setItems(cartItems);
        return orderRepository.save(order);
    }

    // ✅ Logged-in user order
    public Order placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setGuestName(user.getName());
        order.setGuestEmail(user.getEmail());
        order.setGuestPhone(user.getPhone());
        order.setStatus("PLACED");  // use PLACED not PENDING to match your frontend statusConfig
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentMethod().equals("COD") ? "UNPAID" : "PAID");
        order.setShippingAddress(request.getShippingAddress());

        List<CartItem> cartItems = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> itemData : request.getCartItems()) {
            Long productId = Long.valueOf(itemData.get("productId").toString());
            int quantity = Integer.parseInt(itemData.get("quantity").toString());
            double price = Double.parseDouble(itemData.get("price").toString());
            String weight = itemData.get("weight") != null ? itemData.get("weight").toString() : "250g";

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem item = new CartItem();
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(price);
            item.setWeight(weight);
            item.setOrder(order);
            cartItems.add(item);
            total += price;
        }

        order.setTotalAmount(total);
        order.setItems(cartItems);
        return orderRepository.save(order);
    }
    // ✅ Link guest orders to user after registration
    public void linkGuestOrdersToUser(String phone, User user) {
        List<Order> guestOrders = orderRepository.findByGuestPhoneAndUserIsNull(phone);
        guestOrders.forEach(order -> order.setUser(user));
        orderRepository.saveAll(guestOrders);
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return orderRepository.findByUser_Id(user.getId());
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found!"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}