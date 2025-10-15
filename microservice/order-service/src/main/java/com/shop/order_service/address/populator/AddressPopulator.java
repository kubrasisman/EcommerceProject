package com.shop.order_service.address.populator;

import com.shop.order_service.address.dto.AddressData;
import com.shop.order_service.address.model.AddressModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressPopulator {
    AddressData toData(AddressModel address);

    AddressModel toModel(AddressData addressData);

    List<AddressData> toDataList(List<AddressModel> addresses);
    List<AddressModel> toModelList(List<AddressData> addressDataList);
}
