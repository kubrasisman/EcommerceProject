package com.shop.product_service.banner.controller;

import com.shop.product_service.banner.dto.BannerDto;
import com.shop.product_service.banner.dto.response.BannerDtoResponse;
import com.shop.product_service.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/banners")
@RequiredArgsConstructor
@Slf4j
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<BannerDtoResponse> getActiveBanners() {
        log.info("Request received: GET /api/banners");
        List<BannerDtoResponse> response = bannerService.getActiveBanners();
        log.info("Request completed: GET /api/banners - Status: 200, count: {}", response.size());
        return response;
    }

    @GetMapping(value = "/all")
    public List<BannerDtoResponse> getAllBanners() {
        log.info("Request received: GET /api/banners/all");
        List<BannerDtoResponse> response = bannerService.getAllBanners();
        log.info("Request completed: GET /api/banners/all - Status: 200, count: {}", response.size());
        return response;
    }

    @GetMapping(value = "/{code}")
    public BannerDtoResponse getBanner(@PathVariable("code") Long code) {
        log.info("Request received: GET /api/banners/{}", code);
        BannerDtoResponse response = bannerService.getBannerByCode(code);
        log.info("Request completed: GET /api/banners/{} - Status: 200", code);
        return response;
    }

    @PostMapping(value = "/save")
    public BannerDtoResponse saveBanner(@RequestBody BannerDto bannerDto) {
        log.info("Request received: POST /api/banners/save - title: {}", bannerDto.getTitle());
        BannerDtoResponse response = bannerService.createBanner(bannerDto);
        log.info("Request completed: POST /api/banners/save - Status: 200, code: {}", response.getCode());
        return response;
    }

    @PostMapping(value = "/update")
    public BannerDtoResponse updateBanner(@RequestBody BannerDto bannerDto) {
        log.info("Request received: POST /api/banners/update - code: {}", bannerDto.getCode());
        BannerDtoResponse response = bannerService.updateBanner(bannerDto);
        log.info("Request completed: POST /api/banners/update - Status: 200");
        return response;
    }

    @DeleteMapping(value = "/remove/{code}")
    public boolean deleteBanner(@PathVariable Long code) {
        log.info("Request received: DELETE /api/banners/remove/{}", code);
        boolean result = bannerService.deleteBanner(code);
        log.info("Request completed: DELETE /api/banners/remove/{} - Status: 200, success: {}", code, result);
        return result;
    }
}
