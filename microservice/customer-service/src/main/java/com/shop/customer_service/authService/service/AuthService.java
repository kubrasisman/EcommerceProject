package com.shop.customer_service.authService.service;

import com.shop.customer_service.authService.dto.request.AuthRequest;
import com.shop.customer_service.authService.dto.request.RefreshTokenRequest;
import com.shop.customer_service.authService.dto.response.AuthResponse;
import com.shop.customer_service.common.logging.LogMaskingUtil;
import com.shop.customer_service.common.logging.MdcContextUtil;
import com.shop.customer_service.userService.dto.request.RegisterRequest;
import com.shop.customer_service.userService.model.CustomerModel;
import com.shop.customer_service.userService.repository.CustomerRepository;
import com.shop.customer_service.authService.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";
    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    public AuthResponse register(RegisterRequest request) {
        String maskedEmail = LogMaskingUtil.maskEmail(request.getEmail());
        log.info("AUTH: Registration attempt for user: {}", maskedEmail);

        try {
            Optional<CustomerModel> existingCustomer = customerRepository.findByEmail(request.getEmail());
            if (existingCustomer.isPresent()) {
                log.warn("AUTH: Registration failed - email already exists: {}", maskedEmail);
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
            MdcContextUtil.setCustomerContext(savedCustomer.getId());

            log.info("AUTH: Customer registered successfully - customerId: {}", savedCustomer.getId());

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
            log.info("AUTH: Tokens generated for customerId: {}", savedCustomer.getId());

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    savedCustomer.getId().toString(),
                    savedCustomer.getEmail(),
                    savedCustomer.getFullName()
            );
        } catch (RuntimeException e) {
            log.error("AUTH: Registration error for user: {} - {}", maskedEmail, e.getMessage());
            throw e;
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    public AuthResponse login(AuthRequest request) {
        String maskedEmail = LogMaskingUtil.maskEmail(request.getEmail());
        log.info("AUTH: Login attempt for user: {}", maskedEmail);

        try {
            CustomerModel customer = customerRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.warn("AUTH: Login failed - user not found: {}", maskedEmail);
                        return new RuntimeException("Invalid credentials");
                    });

            MdcContextUtil.setCustomerContext(customer.getId());

            if (!customer.getActive()) {
                log.warn("AUTH: Login failed - inactive account: {}, customerId: {}", maskedEmail, customer.getId());
                throw new RuntimeException("Account is not active");
            }

            if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
                log.warn("AUTH: Login failed - invalid password for user: {}, customerId: {}", maskedEmail, customer.getId());
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
            log.info("AUTH: Login successful for user: {}, customerId: {}", maskedEmail, customer.getId());

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    customer.getId().toString(),
                    customer.getEmail(),
                    customer.getFullName()
            );
        } catch (RuntimeException e) {
            if (!e.getMessage().equals("Invalid credentials") && !e.getMessage().equals("Account is not active")) {
                log.error("AUTH: Login error for user: {} - {}", maskedEmail, e.getMessage());
            }
            throw e;
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("AUTH: Token refresh attempt");

        try {
            String refreshToken = request.getRefreshToken();

            if (!jwtUtil.validateToken(refreshToken)) {
                log.warn("AUTH: Token refresh failed - invalid or expired token");
                throw new RuntimeException("Invalid or expired refresh token");
            }

            String customerId = jwtUtil.extractCustomerId(refreshToken);
            MdcContextUtil.setCustomerContext(customerId);

            String storedToken = (String) redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + customerId);

            if (storedToken == null || !storedToken.equals(refreshToken)) {
                log.warn("AUTH: Token refresh failed - token mismatch or not found for customerId: {}", customerId);
                throw new RuntimeException("Refresh token not found or mismatched");
            }

            CustomerModel customer = customerRepository.findById(Long.parseLong(customerId))
                    .orElseThrow(() -> {
                        log.error("AUTH: Token refresh failed - customer not found: {}", customerId);
                        return new RuntimeException("Customer not found");
                    });

            String newAccessToken = jwtUtil.generateAccessToken(
                    customer.getEmail(),
                    customer.getId().toString(),
                    customer.getEmail()
            );

            log.info("AUTH: Token refreshed successfully for customerId: {}", customerId);

            return new AuthResponse(
                    newAccessToken,
                    refreshToken,
                    customer.getId().toString(),
                    customer.getEmail(),
                    customer.getFullName()
            );
        } catch (RuntimeException e) {
            log.error("AUTH: Token refresh error - {}", e.getMessage());
            throw e;
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    public void logout(String customerId) {
        log.info("AUTH: Logout request for customerId: {}", customerId);
        MdcContextUtil.setCustomerContext(customerId);

        try {
            redisTemplate.delete(REFRESH_TOKEN_PREFIX + customerId);
            log.info("AUTH: Logout successful for customerId: {}", customerId);
        } finally {
            MdcContextUtil.clearBusinessContext();
        }
    }

    private void storeRefreshToken(String customerId, String refreshToken) {
        log.debug("AUTH: Storing refresh token for customerId: {}, TTL: {} days", customerId, REFRESH_TOKEN_VALIDITY_DAYS);
        redisTemplate.opsForValue().set(
                REFRESH_TOKEN_PREFIX + customerId,
                refreshToken,
                REFRESH_TOKEN_VALIDITY_DAYS,
                TimeUnit.DAYS
        );
    }
}
