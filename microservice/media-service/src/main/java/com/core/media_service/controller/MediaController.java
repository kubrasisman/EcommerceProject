package com.core.media_service.controller;

import com.core.media_service.dto.MediaPageableResource;
import com.core.media_service.type.MediaType;
import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.dto.MediaResponseDto;
import com.core.media_service.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/media", method = RequestMethod.GET)
@RequiredArgsConstructor
public class MediaController extends AbstractController{

    private final MediaService mediaService;

    @GetMapping("/admin")
    public MediaPageableResource getMedias(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "id") String sort
    ){
        return mediaService.findAllMedia(generatePageable(page,limit,order,sort));
    }

    @PostMapping("/upload/{type}")
    public MediaResponseDto upload(@RequestParam("data") MultipartFile file, @PathVariable("type") MediaType type) {
        MediaRequestDto mediaRequestDto = MediaRequestDto.builder()
                .folder(type.name())
                .type(type)
                .metadata(file)
                .build();
        return mediaService.saveMedia(mediaRequestDto);
    }

    @GetMapping("/type/{type}")
    private MediaPageableResource getMedias(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "creationTime") String sort,
            @PathVariable("type") MediaType type
    ) {
        return mediaService.findMediaByType(type,generatePageable(page,limit,order,sort));
    }

    @DeleteMapping("/admin/{code}")
    public void deleteMedia(@PathVariable("code") String code){
        mediaService.deleteMedia(code);
    }

}

