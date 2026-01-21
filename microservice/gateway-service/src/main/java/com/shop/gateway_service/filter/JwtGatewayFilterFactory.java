package com.shop.gateway_service.filter;

import com.shop.gateway_service.logging.LogMaskingUtil;
import com.shop.gateway_service.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import static com.shop.gateway_service.constant.GatewayConstant.AUTH;

@Component(value = "jwt")
@Slf4j
public class JwtGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtGatewayFilterFactory.Config>{

    private final JwtUtil jwtUtil;

    public JwtGatewayFilterFactory(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestPath = exchange.getRequest().getPath().value();
            String method = exchange.getRequest().getMethod().name();

            String authHeader = exchange.getRequest().getHeaders().getFirst(AUTH);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("GATEWAY JWT: Missing or invalid Authorization header for {} {}", method, requestPath);
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                log.warn("GATEWAY JWT: Token validation failed for {} {}, token: {}", method, requestPath, LogMaskingUtil.maskToken(token));
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String customerId = jwtUtil.extractCustomerId(token);
            String username = jwtUtil.extractUsername(token);
            String email = jwtUtil.extractEmail(token);

            log.debug("GATEWAY JWT: Request authorized for {} {} - customerId: {}, email: {}", method, requestPath, customerId, LogMaskingUtil.maskEmail(email));

            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("x-customer-id", customerId)
                    .header("x-username", username)
                    .header("x-email", email)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    public static class Config {
    }
}
