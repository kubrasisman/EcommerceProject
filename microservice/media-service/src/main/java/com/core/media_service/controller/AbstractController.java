package com.core.media_service.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public abstract class AbstractController {
    public Pageable generatePageable(int page, int limit, String order, String sort) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sortQuery = Sort.by(direction, sort);
        return PageRequest.of(page, limit, sortQuery);
    }
}
