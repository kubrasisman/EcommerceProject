package com.shop.order_service.common.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // RequestContextHolder'dan user email'i al
            RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
            String userEmail = (String) attributes.getAttribute("user", 0);
            requestTemplate.header("x-email", userEmail);
        };
    }
}
