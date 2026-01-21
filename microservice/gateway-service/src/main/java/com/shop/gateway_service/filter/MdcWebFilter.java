package com.shop.gateway_service.filter;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * WebFlux filter for MDC (Mapped Diagnostic Context) management.
 * Handles correlation ID generation/propagation for reactive applications.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class MdcWebFilter implements WebFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_KEY = "correlationId";
    public static final String REQUEST_URI_KEY = "requestUri";
    public static final String TARGET_SERVICE_KEY = "targetService";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String correlationId = exchange.getRequest().getHeaders().getFirst(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        String requestUri = exchange.getRequest().getURI().getPath();
        String targetService = extractTargetService(requestUri);

        final String finalCorrelationId = correlationId;

        // Add correlation ID to response header
        exchange.getResponse().getHeaders().add(CORRELATION_ID_HEADER, correlationId);

        // Mutate request to propagate correlation ID to downstream services
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header(CORRELATION_ID_HEADER, finalCorrelationId)
                .build();

        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(mutatedRequest)
                .build();

        return chain.filter(mutatedExchange)
                .doFirst(() -> {
                    MDC.put(CORRELATION_ID_KEY, finalCorrelationId);
                    MDC.put(REQUEST_URI_KEY, requestUri);
                    MDC.put(TARGET_SERVICE_KEY, targetService);
                })
                .doFinally(signal -> MDC.clear());
    }

    /**
     * Extracts target service name from request URI.
     * Example: /api/products/123 -> product-service
     */
    private String extractTargetService(String uri) {
        if (uri == null) return "unknown";

        if (uri.startsWith("/api/products") || uri.startsWith("/api/categories")) {
            return "product-service";
        } else if (uri.startsWith("/api/cart") || uri.startsWith("/api/orders") || uri.startsWith("/api/payment")) {
            return "order-service";
        } else if (uri.startsWith("/api/auth") || uri.startsWith("/api/customers")) {
            return "customer-service";
        } else if (uri.startsWith("/api/mediaservice")) {
            return "media-service";
        } else if (uri.startsWith("/api/search")) {
            return "search-service";
        }

        return "unknown";
    }
}
