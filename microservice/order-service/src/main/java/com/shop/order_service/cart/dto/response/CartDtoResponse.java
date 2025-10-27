package com.shop.order_service.cart.dto.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CartDtoResponse implements Serializable {

    private String code;
    private CustomerDtoResponse owner;
    private double totalPrice;
    private AddressDtoResponse address;
    private List<CartEntryDtoResponse> entries;

}
