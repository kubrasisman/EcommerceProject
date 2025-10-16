package com.core.media_service.mapping;

import com.core.media_service.dto.MediaResponseDto;
import com.core.media_service.model.MediaModel;
import org.springframework.stereotype.Component;

@Component
public class MediaMapping {
    public static MediaResponseDto mapToMediaResponseDto(MediaModel mediaModel){
        return MediaResponseDto.builder()
                .url(mediaModel.getUrl())
                .alt(mediaModel.getAlt())
                .code(mediaModel.getCode())
                .build();
    }
}
