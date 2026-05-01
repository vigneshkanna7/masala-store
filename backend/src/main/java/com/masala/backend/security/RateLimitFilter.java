package com.masala.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createBucket() {
        return Bucket.builder()
            .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
            .build();
    }

    private Bucket getBucket(String key) {
        return buckets.computeIfAbsent(key, k -> createBucket());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        boolean isRateLimited =
            path.equals("/api/auth/login") ||
            path.equals("/api/auth/forgot-password") ||
            path.equals("/api/orders/place");

        if (isRateLimited) {
            String ip = request.getRemoteAddr();
            Bucket bucket = getBucket(ip + ":" + path);

            if (!bucket.tryConsume(1)) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write(
                    "{\"message\": \"Too many requests. Please try again later.\"}"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}