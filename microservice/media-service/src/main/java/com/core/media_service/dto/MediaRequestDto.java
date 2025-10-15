package com.core.media_service.dto;

import com.core.media_service.type.MediaType;
import com.core.media_service.model.MediaModel;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class MediaRequestDto {
    private MultipartFile metadata;
    private MediaModel media;
    private String folder;
    private MediaType type;
}
