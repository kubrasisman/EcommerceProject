package com.shop.product_service.banner.dto;

import lombok.Data;

@Data
public class BannerDto {
    private Long id;
    private Long code;
    private String title;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean active;
}
