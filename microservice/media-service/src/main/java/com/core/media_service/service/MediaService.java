package com.core.media_service.service;

import com.core.media_service.dto.MediaPageableResource;
import com.core.media_service.type.MediaType;
import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.dto.MediaResponseDto;
import com.core.media_service.model.MediaModel;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MediaService {
    MediaModel getMediaModel(String code);
    ResponseEntity<byte[]> getMedia(String path);
    MediaResponseDto saveMedia(MediaRequestDto media);
    void deleteMedia(String code);
    MediaPageableResource findMediaByType(MediaType type,Pageable pageable);
    MediaPageableResource findAllMedia(Pageable pageable);
}
