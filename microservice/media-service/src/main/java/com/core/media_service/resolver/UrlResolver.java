package com.core.media_service.resolver;

import com.core.media_service.dto.MediaRequestDto;
import com.core.media_service.model.MediaModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class UrlResolver {
    @Value("${default.media.url.format}")
    private String urlFormat;

    public String generate(MediaModel mediaModel){
        return MessageFormat.format(urlFormat, new Object[]{mediaModel.getPath()});
    }
}
