package com.core.media_service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MediaPageableResource {
    private Integer currentPage;
    private Integer totalPage;
    private List<MediaResponseDto> medias;
}
