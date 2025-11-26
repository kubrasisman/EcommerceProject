package com.shop.order_service.payment.populator;

import com.shop.order_service.order.model.OrderModel;
import com.shop.order_service.order.repository.OrderRepository;
import com.shop.order_service.payment.dto.PaymentTransactionData;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class PaymentTransactionPopulator {
    @Autowired
    private OrderRepository orderRepository;

    @Mapping(target = "order", source = "order.code")
    public abstract PaymentTransactionData toData(PaymentTransactionModel payment);
    public abstract PaymentTransactionModel toModel(PaymentTransactionData paymentData);

    public abstract List<PaymentTransactionData> toDataList(List<PaymentTransactionModel> payments);
    public abstract List<PaymentTransactionModel> toModelList(List<PaymentTransactionData> paymentDataList);

    protected OrderModel map(String order) {
        if (order == null) {
            return null;
        }
        return orderRepository.findByCode(order)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with code: " + order));
    }
}
