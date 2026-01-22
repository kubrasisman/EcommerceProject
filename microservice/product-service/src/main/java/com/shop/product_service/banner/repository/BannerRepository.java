package com.shop.product_service.banner.repository;

import com.shop.product_service.banner.model.BannerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<BannerModel, Long> {

    Optional<BannerModel> findByCode(Long code);

    boolean existsByCode(Long code);

    void deleteByCode(Long code);

    List<BannerModel> findByActiveTrueOrderByDisplayOrderAsc();
}
