package com.core.media_service.strategies;

import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.model.MediaModel;

import java.io.IOException;

public interface StorageStrategy {
    void save(MediaRequestDto mediaData) throws IOException;
    void delete(MediaModel mediaModel) throws IOException;
    byte[] get(String path);
}
