package com.shop.order_service.cart.model;


import com.shop.order_service.address.model.AddressModel;
import com.shop.order_service.order.model.AbstractOrderModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import java.util.List;

@Entity
@Table(name = "p_carts")
@Data
public class CartModel extends AbstractOrderModel {
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartEntryModel> entries;

}
