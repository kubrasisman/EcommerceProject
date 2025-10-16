package com.core.media_service.repository;

import com.core.media_service.type.MediaType;
import com.core.media_service.model.MediaModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<MediaModel,Long> {
    MediaModel findByCode(String code);
    Page<MediaModel> findByType(MediaType type, Pageable pageable);
}
