package com.core.media_service.model;

import com.core.media_service.type.MediaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "t_media")
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    private String url;
    private String path;
    private String alt;
    @Enumerated(EnumType.STRING)
    @Column(length = 100)
    private MediaType type;
}
