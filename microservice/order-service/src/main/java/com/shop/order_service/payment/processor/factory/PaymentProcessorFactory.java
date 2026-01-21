package com.shop.order_service.payment.processor.factory;

import com.shop.order_service.payment.processor.PaymentProcessor;
import com.shop.order_service.payment.processor.payment.BankTransferPaymentProcessor;
import com.shop.order_service.payment.type.PaymentMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class PaymentProcessorFactory {
    private final Map<PaymentMethod, PaymentProcessor> processorMap;

    public PaymentProcessorFactory(List<PaymentProcessor> processors) {
        processorMap = processors.stream()
                .collect(Collectors.toMap(
                        p -> {
                            if (p instanceof BankTransferPaymentProcessor) return PaymentMethod.WIRE_TRANSFER;
                            // Add other paymentprocesser here
                            throw new IllegalStateException("Unknown processor type");
                        },
                        p -> p
                ));
        log.info("PAYMENT: PaymentProcessorFactory initialized with {} processors", processorMap.size());
    }

    public PaymentProcessor getProcessor(PaymentMethod method) {
        log.debug("PAYMENT: Getting processor for payment method: {}", method);
        PaymentProcessor processor = processorMap.get(method);
        if (processor == null) {
            log.error("PAYMENT: No processor found for payment method: {}", method);
            throw new IllegalArgumentException("No processor for " + method);
        }
        return processor;
    }
}
