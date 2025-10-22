package com.shop.order_service.cart.model;


import com.shop.order_service.address.model.AddressModel;
import com.shop.order_service.order.model.AbstractOrderModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


import java.util.List;


@Entity
@Table(name = "p_carts")
@Data
@EqualsAndHashCode(callSuper = true)
public class CartModel extends AbstractOrderModel {

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private List<CartEntryModel> entries;

}
