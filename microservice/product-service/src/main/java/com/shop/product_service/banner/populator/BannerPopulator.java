package com.shop.product_service.banner.populator;

import com.shop.product_service.banner.dto.BannerDto;
import com.shop.product_service.banner.dto.response.BannerDtoResponse;
import com.shop.product_service.banner.model.BannerModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BannerPopulator {

    BannerDto toData(BannerModel banner);

    BannerModel toModel(BannerDto dto);

    BannerDtoResponse toDtoResponse(BannerModel banner);
}
