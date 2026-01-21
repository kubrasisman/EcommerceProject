package com.shop.customer_service.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter that sets up MDC (Mapped Diagnostic Context) for logging.
 * Handles correlation ID generation/propagation and user context.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MdcLoggingFilter extends OncePerRequestFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_MDC_KEY = "correlationId";
    public static final String USER_ID_MDC_KEY = "userId";
    public static final String REQUEST_URI_MDC_KEY = "requestUri";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Get or generate correlation ID
            String correlationId = request.getHeader(CORRELATION_ID_HEADER);
            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }

            // Set MDC values
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
            MDC.put(REQUEST_URI_MDC_KEY, request.getRequestURI());

            // Get user ID from gateway-propagated header
            String customerId = request.getHeader("x-customer-id");
            if (customerId != null && !customerId.isBlank()) {
                MDC.put(USER_ID_MDC_KEY, customerId);
                MDC.put("customerId", customerId);
            }

            // Get user email from gateway-propagated header
            String userEmail = request.getHeader("x-email");
            if (userEmail != null && !userEmail.isBlank()) {
                MDC.put("userEmail", LogMaskingUtil.maskEmail(userEmail));
            }

            // Add correlation ID to response header for client tracking
            response.setHeader(CORRELATION_ID_HEADER, correlationId);

            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}