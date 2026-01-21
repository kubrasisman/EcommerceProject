package com.shop.order_service.common.interceptor;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Feign client interceptor that propagates correlation ID and user context
 * to downstream service calls.
 */
@Component
@Slf4j
public class FeignClientInterceptor implements RequestInterceptor {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    public void apply(RequestTemplate template) {
        // Propagate correlation ID from MDC
        String correlationId = MDC.get(CORRELATION_ID_MDC_KEY);
        if (correlationId != null && !correlationId.isBlank()) {
            template.header(CORRELATION_ID_HEADER, correlationId);
        }

        // Propagate user headers from original request
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();

            String customerId = request.getHeader("x-customer-id");
            String email = request.getHeader("x-email");
            String username = request.getHeader("x-username");

            if (customerId != null) {
                template.header("x-customer-id", customerId);
            }
            if (email != null) {
                template.header("x-email", email);
            }
            if (username != null) {
                template.header("x-username", username);
            }
        }

        log.debug("FEIGN: Calling {} {} with correlationId: {}",
                template.method(), template.url(), correlationId);
    }
}
