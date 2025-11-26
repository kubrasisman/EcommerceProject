package com.shop.order_service.cart.dto.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CartDtoResponse implements Serializable {

    private Long id;
    private String code;
    private CustomerDtoResponse owner;
    private double totalPrice;
    private String customerEmail;
    private AddressDtoResponse address;
    private List<CartEntryDtoResponse> entries;

}
