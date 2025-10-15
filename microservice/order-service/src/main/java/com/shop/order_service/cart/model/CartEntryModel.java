package com.shop.order_service.cart.model;

import com.shop.order_service.order.model.AbstractOrderEntryModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "p_cartentries")
@Data
public class CartEntryModel  extends AbstractOrderEntryModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private CartModel cart;

}
