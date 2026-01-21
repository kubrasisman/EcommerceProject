package com.shop.customer_service.authService.controller;

import com.shop.customer_service.authService.dto.request.AuthRequest;
import com.shop.customer_service.authService.dto.request.RefreshTokenRequest;
import com.shop.customer_service.authService.dto.response.AuthResponse;
import com.shop.customer_service.authService.service.AuthService;
import com.shop.customer_service.common.logging.LogMaskingUtil;
import com.shop.customer_service.userService.dto.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Request received: POST /api/auth/register - email: {}", LogMaskingUtil.maskEmail(request.getEmail()));
        try {
            AuthResponse response = authService.register(request);
            log.info("Request completed: POST /api/auth/register - Status: 201, customerId: {}", response.getCustomerId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.warn("Request failed: POST /api/auth/register - Status: 400, error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        log.info("Request received: POST /api/auth/login - email: {}", LogMaskingUtil.maskEmail(request.getEmail()));
        try {
            AuthResponse response = authService.login(request);
            log.info("Request completed: POST /api/auth/login - Status: 200, customerId: {}", response.getCustomerId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("Request failed: POST /api/auth/login - Status: 401, error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        log.info("Request received: POST /api/auth/refresh");
        try {
            AuthResponse response = authService.refreshToken(request);
            log.info("Request completed: POST /api/auth/refresh - Status: 200, customerId: {}", response.getCustomerId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("Request failed: POST /api/auth/refresh - Status: 401, error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("X-Customer-Id") String customerId) {
        log.info("Request received: POST /api/auth/logout - customerId: {}", customerId);
        authService.logout(customerId);
        log.info("Request completed: POST /api/auth/logout - Status: 200, customerId: {}", customerId);
        return ResponseEntity.ok().build();
    }
}
