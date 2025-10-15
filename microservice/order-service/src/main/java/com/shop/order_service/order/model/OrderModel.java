package com.shop.order_service.order.model;

import com.shop.order_service.payment.model.PaymentTransactionModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "p_orders")
@Data
public class OrderModel extends AbstractOrderModel {

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private PaymentTransactionModel payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderEntryModel> entries;
    private String status; //todo make it enum
}
