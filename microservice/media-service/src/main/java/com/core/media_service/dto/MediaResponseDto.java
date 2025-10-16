package com.core.media_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MediaResponseDto {
    private String code;
    private String url;
    private String alt;
}
