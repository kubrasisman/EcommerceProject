package com.shop.order_service.order.model;

import com.shop.order_service.order.type.OrderStatus;
import com.shop.order_service.payment.model.PaymentTransactionModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;

@Entity
@Table(name = "p_orders")
@Data
@EqualsAndHashCode(callSuper = true)
public class OrderModel extends AbstractOrderModel {

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private PaymentTransactionModel payment;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private List<OrderEntryModel> entries;

    @Column(length = 255, nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
