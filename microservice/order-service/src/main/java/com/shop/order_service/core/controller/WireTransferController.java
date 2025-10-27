package com.shop.order_service.core.controller;

import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.cart.service.CartService;
import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.service.OrderService;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/payment/transfer")
@RequiredArgsConstructor
@Slf4j
public class WireTransferController {

    private final OrderService orderService;
    private final CartService cartService;
    @PostMapping(value = "/{cartCode}")
    public OrderDtoResponse placeBankTransferOrder(@PathVariable(value = "cartCode") String cartCode) {
        log.info("Wire Transfer place order request received for cart: {}", cartCode);
        CartModel cartModel = cartService.getCartByCode(cartCode);
        cartModel.setPaymentMethod(PaymentMethod.WIRE_TRANSFER);
        OrderDtoResponse response = orderService.placeOrder(cartModel);
        log.info("Order created with code: {}", response.getCode());
        return response;//todo orderconfirmation
    }
}
