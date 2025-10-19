package com.shop.customer_service.service;

import com.shop.customer_service.dto.*;
import com.shop.customer_service.model.CustomerModel;
import com.shop.customer_service.repository.CustomerRepository;
import com.shop.customer_service.util.JwtUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";
    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    public AuthService(CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       RedisTemplate<String, Object> redisTemplate) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    public AuthResponse register(RegisterRequest request) {
        Optional<CustomerModel> existingCustomer = customerRepository.findByEmail(request.getEmail());
        if (existingCustomer.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        CustomerModel customer = new CustomerModel();
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setKvkkConsent(request.getKvkkConsent());
        customer.setActive(true);
        customer.setEmailValid(false);

        CustomerModel savedCustomer = customerRepository.save(customer);

        String accessToken = jwtUtil.generateAccessToken(
                savedCustomer.getEmail(),
                savedCustomer.getId().toString(),
                savedCustomer.getEmail()
        );
        String refreshToken = jwtUtil.generateRefreshToken(
                savedCustomer.getEmail(),
                savedCustomer.getId().toString()
        );

        storeRefreshToken(savedCustomer.getId().toString(), refreshToken);

        return new AuthResponse(
                accessToken,
                refreshToken,
                savedCustomer.getId().toString(),
                savedCustomer.getEmail(),
                savedCustomer.getFullName()
        );
    }

    public AuthResponse login(AuthRequest request) {
        CustomerModel customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!customer.getActive()) {
            throw new RuntimeException("Account is not active");
        }

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateAccessToken(
                customer.getEmail(),
                customer.getId().toString(),
                customer.getEmail()
        );
        String refreshToken = jwtUtil.generateRefreshToken(
                customer.getEmail(),
                customer.getId().toString()
        );

        storeRefreshToken(customer.getId().toString(), refreshToken);

        return new AuthResponse(
                accessToken,
                refreshToken,
                customer.getId().toString(),
                customer.getEmail(),
                customer.getFullName()
        );
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String customerId = jwtUtil.extractCustomerId(refreshToken);
        String storedToken = (String) redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + customerId);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new RuntimeException("Refresh token not found or mismatched");
        }

        CustomerModel customer = customerRepository.findById(Long.parseLong(customerId))
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String newAccessToken = jwtUtil.generateAccessToken(
                customer.getEmail(),
                customer.getId().toString(),
                customer.getEmail()
        );

        return new AuthResponse(
                newAccessToken,
                refreshToken,
                customer.getId().toString(),
                customer.getEmail(),
                customer.getFullName()
        );
    }

    public void logout(String customerId) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + customerId);
    }

    private void storeRefreshToken(String customerId, String refreshToken) {
        redisTemplate.opsForValue().set(
                REFRESH_TOKEN_PREFIX + customerId,
                refreshToken,
                REFRESH_TOKEN_VALIDITY_DAYS,
                TimeUnit.DAYS
        );
    }
}
