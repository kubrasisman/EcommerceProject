package com.shop.product_service.banner.dto.response;

import lombok.Data;

@Data
public class BannerDtoResponse {
    private Long id;
    private Long code;
    private String title;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean active;
}
