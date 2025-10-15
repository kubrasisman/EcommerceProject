package com.shop.order_service.payment.populator;

import com.shop.order_service.payment.dto.PaymentTransactionData;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentTransactionPopulator {
    PaymentTransactionData toData(PaymentTransactionModel payment);

    PaymentTransactionModel toModel(PaymentTransactionData paymentData);

    List<PaymentTransactionData> toDataList(List<PaymentTransactionModel> payments);
    List<PaymentTransactionModel> toModelList(List<PaymentTransactionData> paymentDataList);

}
