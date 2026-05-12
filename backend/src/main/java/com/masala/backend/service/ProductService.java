package com.masala.backend.service;

import com.masala.backend.model.Product;
import com.masala.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product product = getProductById(id);
        product.setName(updated.getName());
        product.setDescription(updated.getDescription());
        product.setPrice(updated.getPrice());
        product.setImageUrl(updated.getImageUrl());
        product.setStock(updated.getStock());
        product.setCategory(updated.getCategory());
        product.setIngredients(updated.getIngredients());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<Product> getBestSellers() {
        return productRepository.findByBestSellerTrue();
    }
}
