package com.shop.order_service.order.populator;

import com.shop.order_service.cart.dto.response.CustomerDtoResponse;
import com.shop.order_service.cart.model.CartEntryModel;
import com.shop.order_service.cart.model.CartModel;
import com.shop.order_service.common.populator.CommonPopulator;
import com.shop.order_service.order.dto.OrderData;
import com.shop.order_service.order.dto.OrderEntryData;
import com.shop.order_service.order.dto.response.OrderDtoResponse;
import com.shop.order_service.order.dto.response.OrderEntryDtoResponse;
import com.shop.order_service.order.model.OrderEntryModel;
import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.order.repository.OrderRepository;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import com.shop.order_service.payment.populator.PaymentTransactionPopulator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = { PaymentTransactionPopulator.class })
public abstract class OrderPopulator extends CommonPopulator {
    @Autowired
    OrderRepository orderRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    public abstract OrderModel toModel(OrderData orderData);
    @Mapping(target = "address", expression = "java(findAddress(orderModel.getAddress()))")
    @Mapping(target = "owner", expression = "java(findCustomer(orderModel.getOwner()))")
    public abstract OrderDtoResponse toResponseDto(OrderModel orderModel);

    public abstract List<OrderModel> toModelList(List<OrderData> orders);
    public abstract List<OrderDtoResponse> toResponseDtoList(List<OrderModel> orders);

    @Mapping(target = "product", expression = "java(findProduct(entry.getProduct()))")
    public abstract OrderEntryDtoResponse toEntryResponseDto(OrderEntryModel entry);
    public abstract List<OrderEntryModel> toEntryModelList(List<OrderEntryData> entryDataList);
    public abstract List<OrderEntryDtoResponse> toEntryResponseDtoList(List<OrderEntryModel> entries);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "status", ignore = true)
    public abstract OrderModel cartToOrder(CartModel cart);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "canceledAmount", constant = "0")
    @Mapping(target = "shippedAmount", constant = "0")
    public abstract OrderEntryModel cartEntryToOrderEntry(CartEntryModel cartEntry);

    public abstract List<OrderEntryModel> cartEntriesToOrderEntries(List<CartEntryModel> cartEntries);

}
