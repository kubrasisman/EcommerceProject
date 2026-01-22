package com.shop.product_service.banner.service.impl;

import com.shop.product_service.banner.dto.BannerDto;
import com.shop.product_service.banner.dto.response.BannerDtoResponse;
import com.shop.product_service.banner.model.BannerModel;
import com.shop.product_service.banner.populator.BannerPopulator;
import com.shop.product_service.banner.repository.BannerRepository;
import com.shop.product_service.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final BannerPopulator bannerPopulator;

    @Override
    public List<BannerDtoResponse> getActiveBanners() {
        log.info("BANNER: Fetching active banners");
        List<BannerModel> banners = bannerRepository.findByActiveTrueOrderByDisplayOrderAsc();
        log.info("BANNER: Found {} active banners", banners.size());
        return banners.stream()
                .map(bannerPopulator::toDtoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BannerDtoResponse> getAllBanners() {
        log.info("BANNER: Fetching all banners");
        List<BannerModel> banners = bannerRepository.findAll();
        log.info("BANNER: Found {} banners", banners.size());
        return banners.stream()
                .map(bannerPopulator::toDtoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BannerDtoResponse getBannerByCode(Long code) {
        log.info("BANNER: Fetching banner by code: {}", code);
        BannerModel banner = bannerRepository.findByCode(code)
                .orElseThrow(() -> {
                    log.warn("BANNER: Banner not found with code: {}", code);
                    return new RuntimeException("Banner not found with code: " + code);
                });
        log.info("BANNER: Found banner - code: {}, title: {}", code, banner.getTitle());
        return bannerPopulator.toDtoResponse(banner);
    }

    @Override
    @Transactional
    public BannerDtoResponse createBanner(BannerDto bannerDto) {
        if (bannerDto == null) {
            log.warn("BANNER: createBanner called with null bannerDto");
            throw new IllegalArgumentException("Banner data must not be null");
        }
        log.info("BANNER: Creating banner - title: {}", bannerDto.getTitle());

        if (bannerDto.getCode() != null && bannerRepository.existsByCode(bannerDto.getCode())) {
            log.warn("BANNER: Banner with code {} already exists", bannerDto.getCode());
            return bannerPopulator.toDtoResponse(bannerRepository.findByCode(bannerDto.getCode()).get());
        }

        BannerModel banner = bannerPopulator.toModel(bannerDto);
        BannerModel saved = bannerRepository.save(banner);
        log.info("BANNER: Banner created successfully - code: {}", saved.getCode());
        return bannerPopulator.toDtoResponse(saved);
    }

    @Override
    @Transactional
    public BannerDtoResponse updateBanner(BannerDto bannerDto) {
        if (bannerDto == null || bannerDto.getCode() == null) {
            log.warn("BANNER: updateBanner called with null bannerDto or code");
            throw new IllegalArgumentException("Banner data and code must not be null");
        }
        log.info("BANNER: Updating banner - code: {}", bannerDto.getCode());

        BannerModel existing = bannerRepository.findByCode(bannerDto.getCode())
                .orElseThrow(() -> {
                    log.warn("BANNER: Banner not found for update - code: {}", bannerDto.getCode());
                    return new RuntimeException("Banner not found with code: " + bannerDto.getCode());
                });

        existing.setTitle(bannerDto.getTitle());
        existing.setDescription(bannerDto.getDescription());
        existing.setImageUrl(bannerDto.getImageUrl());
        existing.setLinkUrl(bannerDto.getLinkUrl());
        existing.setDisplayOrder(bannerDto.getDisplayOrder());
        existing.setActive(bannerDto.getActive());

        BannerModel updated = bannerRepository.save(existing);
        log.info("BANNER: Banner updated successfully - code: {}", updated.getCode());
        return bannerPopulator.toDtoResponse(updated);
    }

    @Override
    @Transactional
    public boolean deleteBanner(Long code) {
        if (code == null) {
            log.warn("BANNER: deleteBanner called with null code");
            throw new IllegalArgumentException("Banner code must not be null");
        }
        log.info("BANNER: Deleting banner - code: {}", code);

        if (!bannerRepository.existsByCode(code)) {
            log.info("BANNER: Banner not found for deletion - code: {}", code);
            return false;
        }

        bannerRepository.deleteByCode(code);
        log.info("BANNER: Banner deleted successfully - code: {}", code);
        return true;
    }
}
