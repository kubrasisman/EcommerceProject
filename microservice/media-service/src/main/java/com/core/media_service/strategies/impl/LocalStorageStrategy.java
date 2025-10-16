package com.core.media_service.strategies.impl;

import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.model.MediaModel;
import com.core.media_service.strategies.StorageStrategy;
import com.core.media_service.utils.MediaUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Component("localStorageStrategy")
@Slf4j
@RequiredArgsConstructor
public class LocalStorageStrategy implements StorageStrategy {
    private final MediaUtils mediaUtils;

    @Override
    public void save(MediaRequestDto mediaData) throws IOException {
        MultipartFile multipartFile = mediaData.getMetadata();
        final Path basePath = mediaUtils.getSaveDirectory();
        final Path imagePath = Paths.get(basePath.toString(), mediaData.getMedia().getPath());
        try {
            Path directories = Files.createDirectories(imagePath);
            BufferedImage read = ImageIO.read(multipartFile.getInputStream());
            ImageIO.write(read, resoleFileExtension(MediaUtils.keepLettersAndDigits(mediaData.getMedia().getName())), directories.toFile());
        } catch (IOException e) {
            Files.delete(imagePath);
            throw new RuntimeException("FileCannot save" + e.getMessage());
        }
    }

    private String resoleFileExtension(String file) {
        List<String> parts = Arrays.stream(file.split("\\.")).toList();
        return parts.get(parts.size() - 1);
    }

    @Override
    public void delete(MediaModel mediaModel) throws IOException {
        final Path basePath = mediaUtils.getSaveDirectory();
        final Path imagePath = Paths.get(basePath.toString(), mediaModel.getPath());
        Files.deleteIfExists(imagePath);
    }

    @Override
    public byte[] get(String path) {
        final Path basePath = mediaUtils.getSaveDirectory();
        final Path imagePath = Paths.get(basePath.toString(), path);
        try {
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource.getContentAsByteArray();
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (Exception ex) {
            throw new RuntimeException("Could not read the file!");
        }


    }
}
