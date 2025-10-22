package com.shop.order_service.order.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "p_order_entry")
@Data
@EqualsAndHashCode(callSuper = true)
public class OrderEntryModel extends AbstractOrderEntryModel {
    private Integer canceledAmount;
    private Integer shippedAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private OrderModel order;
}
