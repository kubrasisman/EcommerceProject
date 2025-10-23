package com.shop.order_service.common.interceptor;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Autowired
    private HttpServletRequest request;

    @Override
    public void apply(RequestTemplate template) {
   //Use if any interceptor for feign needed
    }
}
