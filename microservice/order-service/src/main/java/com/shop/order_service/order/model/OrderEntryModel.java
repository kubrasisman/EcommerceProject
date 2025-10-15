package com.shop.order_service.order.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "p_orderentries")
@Data
public class OrderEntryModel extends AbstractOrderEntryModel{
    private Integer canceledAmount;
    private Integer shippedAmount;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrderModel order;
}
