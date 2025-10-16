package com.core.media_service.utils;

import com.core.media_service.dto.MediaRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class MediaUtils {
    @Value("${info.root-dir}")
    private String systemLocation;

    public Path getSaveDirectory() {
        return Paths.get(systemLocation, "modules","media-service", "media");
    }

    public static String resolveSavePath(String folder, String code, String originalName) {
        return "/" + folder + "/" + code + "/" + originalName;
    }


    public static String keepLettersAndDigits(String input) {
        if (input == null) return null;

        int dotIndex = input.lastIndexOf('.');
        String name = dotIndex >= 0 ? input.substring(0, dotIndex) : input;
        String extension = dotIndex >= 0 ? input.substring(dotIndex) : "";

        // İsmi temizle, sadece harfler ve rakamlar kalsın
        name = name.replaceAll("[^\\p{L}\\p{Nd}]+", "");

        return name + extension;
    }
}
