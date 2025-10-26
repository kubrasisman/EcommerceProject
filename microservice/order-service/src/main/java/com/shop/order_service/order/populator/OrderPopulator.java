package com.shop.order_service.order.populator;

import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.order.dto.OrderData;
import com.shop.order_service.order.dto.OrderEntryData;
import com.shop.order_service.order.model.OrderEntryModel;
import com.shop.order_service.order.model.OrderModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderPopulator {
    OrderData toData(OrderModel order);
    OrderModel toModel(OrderData orderData);
    List<OrderData> toDataList(List<OrderModel> orders);
    List<OrderModel> toModelList(List<OrderData> orders);
    OrderEntryData toEntryData(OrderEntryModel entry);
    OrderEntryModel toEntryModel(OrderEntryData entryData);
    List<OrderEntryData> toEntryDataList(List<OrderEntryModel> entries);
    List<OrderEntryModel> toEntryModelList(List<OrderEntryData> entries);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "payment", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "entries", ignore = true)
    OrderModel cartToOrder(CartModel cart);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "canceledAmount", constant = "0")
    @Mapping(target = "shippedAmount", constant = "0")
    OrderEntryModel cartEntryToOrderEntry(CartEntryModel cartEntry);

    List<OrderEntryModel> cartEntriesToOrderEntries(List<CartEntryModel> cartEntries);
}
