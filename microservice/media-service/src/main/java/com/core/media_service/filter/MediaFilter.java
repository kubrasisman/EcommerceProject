package com.core.media_service.filter;

import com.core.media_service.service.MediaService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
@Slf4j
@RequiredArgsConstructor
public class MediaFilter extends OncePerRequestFilter {
    private final MediaService mediaService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.contains("admin") || requestURI.contains("type")){
            filterChain.doFilter(request, response);
            return;
        }
        if (requestURI.contains("media") && request.getMethod().equals("GET")) {
            String replace = requestURI.replace("/api/v1/media", "");
            ResponseEntity<byte[]> media = mediaService.getMedia(replace);

            // Set the response status code
            response.setStatus(media.getStatusCodeValue());
            // Set headers from ResponseEntity
            media.getHeaders().forEach((key, values) -> {
                for (String value : values) {
                    response.addHeader(key, value);
                }
            });

            // Write the body content to the response output stream
            byte[] body = media.getBody();
            if (body != null) {
                response.setContentType(MediaType.IMAGE_JPEG.toString());
                response.getOutputStream().write(body);
            }
            return;
        }

        // Proceed with the next filter if the condition doesn't match
        filterChain.doFilter(request, response);
    }
}
