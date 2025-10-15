package com.shop.order_service.order.populator;

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
}
