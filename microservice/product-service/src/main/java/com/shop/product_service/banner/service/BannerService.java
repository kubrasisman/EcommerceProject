package com.shop.product_service.banner.service;

import com.shop.product_service.banner.dto.BannerDto;
import com.shop.product_service.banner.dto.response.BannerDtoResponse;

import java.util.List;

public interface BannerService {

    List<BannerDtoResponse> getActiveBanners();

    List<BannerDtoResponse> getAllBanners();

    BannerDtoResponse getBannerByCode(Long code);

    BannerDtoResponse createBanner(BannerDto bannerDto);

    BannerDtoResponse updateBanner(BannerDto bannerDto);

    boolean deleteBanner(Long code);
}
