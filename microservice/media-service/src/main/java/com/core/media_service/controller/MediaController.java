package com.core.media_service.controller;

import com.core.media_service.dto.MediaPageableResource;
import com.core.media_service.type.MediaType;
import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.dto.MediaResponseDto;
import com.core.media_service.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/media", method = RequestMethod.GET)
@RequiredArgsConstructor
@Slf4j
public class MediaController extends AbstractController{

    private final MediaService mediaService;

    @GetMapping("/admin")
    public MediaPageableResource getMedias(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "id") String sort
    ){
        log.info("Request received: GET /api/v1/media/admin - page: {}, limit: {}", page, limit);
        MediaPageableResource response = mediaService.findAllMedia(generatePageable(page,limit,order,sort));
        log.info("Request completed: GET /api/v1/media/admin - Status: 200");
        return response;
    }

    @PostMapping("/upload/{type}")
    public MediaResponseDto upload(@RequestParam("data") MultipartFile file, @PathVariable("type") MediaType type) {
        log.info("Request received: POST /api/v1/media/upload/{} - fileName: {}, size: {} bytes", type, file.getOriginalFilename(), file.getSize());
        MediaRequestDto mediaRequestDto = MediaRequestDto.builder()
                .folder(type.name())
                .type(type)
                .metadata(file)
                .build();
        MediaResponseDto response = mediaService.saveMedia(mediaRequestDto);
        log.info("Request completed: POST /api/v1/media/upload/{} - Status: 200, mediaCode: {}", type, response.getCode());
        return response;
    }

    @GetMapping("/type/{type}")
    private MediaPageableResource getMedias(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "order", required = false, defaultValue = "ASC") String order,
            @RequestParam(value = "sort", required = false, defaultValue = "creationTime") String sort,
            @PathVariable("type") MediaType type
    ) {
        log.info("Request received: GET /api/v1/media/type/{} - page: {}, limit: {}", type, page, limit);
        MediaPageableResource response = mediaService.findMediaByType(type,generatePageable(page,limit,order,sort));
        log.info("Request completed: GET /api/v1/media/type/{} - Status: 200", type);
        return response;
    }

    @DeleteMapping("/admin/{code}")
    public void deleteMedia(@PathVariable("code") String code){
        log.info("Request received: DELETE /api/v1/media/admin/{}", code);
        mediaService.deleteMedia(code);
        log.info("Request completed: DELETE /api/v1/media/admin/{} - Status: 200", code);
    }

}

