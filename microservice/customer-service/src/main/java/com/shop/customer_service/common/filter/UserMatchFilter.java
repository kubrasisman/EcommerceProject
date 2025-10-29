package com.shop.customer_service.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

@Component
@AllArgsConstructor
@Slf4j
public class UserMatchFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        log.info("=== UserMatchFilter triggered for path: {}", path);

        // Tüm header'ları logla
        Collections.list(request.getHeaderNames()).forEach(headerName ->
                log.info("Header: {} = {}", headerName, request.getHeader(headerName))
        );

        String userEmail = request.getHeader("x-email");
        log.info("x-email value: {}", userEmail);

        if (StringUtils.isNotEmpty(userEmail)) {
            Objects.requireNonNull(RequestContextHolder.getRequestAttributes())
                    .setAttribute("user", userEmail, 0);
            log.info("✅ User email set in RequestContext: {}", userEmail);
        } else {
            log.warn("⚠️ x-email header is NULL or EMPTY!");
        }

        filterChain.doFilter(request, response);
    }
}
