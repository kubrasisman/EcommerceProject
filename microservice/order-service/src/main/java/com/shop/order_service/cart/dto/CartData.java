package com.shop.order_service.cart.dto;

import com.shop.order_service.address.dto.AddressData;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartData implements Serializable {

    private Long id;
    private String code;
    private double totalPrice;
    private String customerEmail;
    private AddressData address;
    private List<CartEntryData> entries;

}
