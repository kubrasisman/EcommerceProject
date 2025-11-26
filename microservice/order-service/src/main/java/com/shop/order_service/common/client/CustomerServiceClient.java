package com.shop.order_service.common.client;

import com.shop.order_service.cart.dto.response.AddressDtoResponse;
import com.shop.order_service.cart.dto.response.CustomerDtoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "customer-service", path = "/api")
public interface CustomerServiceClient {

    @GetMapping(value = "/customers/{id}")
    CustomerDtoResponse getCustomer(@PathVariable("id") String code);

    @GetMapping(value = "/address/{id}")
    AddressDtoResponse getAddress(@PathVariable("id") Long code);

}
