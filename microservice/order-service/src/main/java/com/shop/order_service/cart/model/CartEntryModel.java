package com.shop.order_service.cart.model;

import com.shop.order_service.order.model.AbstractOrderEntryModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;



@Entity
@Table(name = "p_cart_entry")
@Data
@EqualsAndHashCode(callSuper = true)
public class CartEntryModel  extends AbstractOrderEntryModel {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private CartModel cart;
}
