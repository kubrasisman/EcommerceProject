package com.shop.order_service.cart.populator;

import com.shop.order_service.address.populator.AddressPopulator;
import com.shop.order_service.cart.dto.CartData;
import com.shop.order_service.cart.dto.CartEntryData;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.payment.populator.PaymentTransactionPopulator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartPopulator {

    CartData toData(CartModel model);
    CartModel toModel(CartData data);
    CartEntryModel toEntryModel(CartEntryData entryData);
    CartEntryData toEntryData(CartEntryModel entry);
    List<CartEntryData> toEntryDataList(List<CartEntryModel> entries);
    List<CartEntryModel> toEntryModelList(List<CartEntryData> entries);
}
