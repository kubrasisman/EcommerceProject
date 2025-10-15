package com.core.media_service.service.impl;

import com.core.media_service.dto.MediaPageableResource;
import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.dto.MediaResponseDto;
import com.core.media_service.mapping.MediaMapping;
import com.core.media_service.model.MediaModel;
import com.core.media_service.repository.MediaRepository;
import com.core.media_service.resolver.UrlResolver;
import com.core.media_service.service.MediaService;
import com.core.media_service.strategies.StorageStrategy;
import com.core.media_service.utils.MediaUtils;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DefaultMediaService implements MediaService {
    private final MediaRepository mediaRepository;
    private final UrlResolver urlResolver;
    @Resource(name = "localStorageStrategy")
    private StorageStrategy storageStrategy;

    @Override
    public MediaModel getMediaModel(String code) {
        return mediaRepository.findByCode(code);
    }

    @Override
    public ResponseEntity<byte[]> getMedia(String path) {
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(storageStrategy.get(path));
    }

    @Override
    public MediaResponseDto saveMedia(MediaRequestDto mediaRequestDto) {
        String code = UUID.randomUUID().toString();
        String name = MediaUtils.keepLettersAndDigits(mediaRequestDto.getMetadata().getName());
        String originalName = MediaUtils.keepLettersAndDigits(mediaRequestDto.getMetadata().getOriginalFilename());
        MediaModel mediaModel = MediaModel.builder()
                .code(code)
                .alt(name)
                .name(mediaRequestDto.getMetadata().getOriginalFilename())
                .path(MediaUtils.resolveSavePath(mediaRequestDto.getFolder(), code, originalName))
                .type(mediaRequestDto.getType())
                .build();

        MediaModel savedMediaModel = mediaRepository.save(mediaModel);
        mediaRequestDto.setMedia(savedMediaModel);

        try {
            storageStrategy.save(mediaRequestDto);
            savedMediaModel.setUrl(urlResolver.generate(savedMediaModel));
            return MediaMapping.mapToMediaResponseDto(savedMediaModel);
        } catch (Exception ex) {
            throw new RuntimeException("Getting error while saving media",ex);
        }
    }

    @Override
    public void deleteMedia(String code) {
        MediaModel media = this.getMediaModel(code);
        if (media == null) {
            throw new RuntimeException("Media already deleted");
        }

        try {
            storageStrategy.delete(media);
            mediaRepository.delete(media);
        } catch (Exception ex) {
            throw new RuntimeException("Getting error while deleting media in storage ", ex);
        }
    }

    @Override
    public MediaPageableResource findMediaByType(com.core.media_service.type.MediaType type,Pageable pageable) {
        Page<MediaModel> medias = mediaRepository.findByType(type,pageable);
        List<MediaResponseDto> list = medias.stream().map(MediaMapping::mapToMediaResponseDto).toList();
        return MediaPageableResource.builder()
                .currentPage(medias.getNumber())
                .totalPage(medias.getTotalPages())
                .medias(list)
                .build();
    }

    @Override
    public MediaPageableResource findAllMedia(Pageable pageable) {
        Page<MediaModel> medias = mediaRepository.findAll(pageable);
        List<MediaResponseDto> list = medias.stream().map(MediaMapping::mapToMediaResponseDto).toList();
        return MediaPageableResource.builder()
                .currentPage(medias.getNumber())
                .totalPage(medias.getTotalPages())
                .medias(list)
                .build();
    }
}
