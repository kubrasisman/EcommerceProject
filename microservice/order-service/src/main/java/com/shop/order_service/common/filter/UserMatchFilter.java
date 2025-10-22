package com.shop.order_service.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@AllArgsConstructor
@Slf4j
public class UserMatchFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String userHeader = request.getHeader("X-email");
            if (StringUtils.isNotEmpty(userHeader)) {
                Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).setAttribute("user", userHeader, 0);
            }
        } catch (Exception e) {
            filterChain.doFilter(request, response);
        } finally {
            filterChain.doFilter(request, response);
        }

    }
}
