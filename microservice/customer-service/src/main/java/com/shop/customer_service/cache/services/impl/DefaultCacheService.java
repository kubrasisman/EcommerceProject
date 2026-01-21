package com.shop.customer_service.cache.services.impl;

import com.shop.customer_service.cache.services.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultCacheService implements CacheService {
    private static final long DEFAULT_SESSION_TTL_HOURS = 24;
    private final RedisTemplate<String, Object> redisTemplate;
    @Value("${spring.application.name}")
    private String serviceName;

    @Override
    public void saveCache(String prefix, String key, Object value) {
        saveCache(prefix, key, value, DEFAULT_SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    @Override
    public void saveCache(String prefix, String key, Object value, long ttl_hours) {
        saveCache(prefix, key, value, ttl_hours, TimeUnit.HOURS);
    }

    @Override
    public void saveCache(String prefix, String key, Object value, long ttl_hours, TimeUnit timeUnit) {
        String fullKey = keyBuilder(prefix, key);
        log.debug("CACHE: Storing key: {}, TTL: {} {}", fullKey, ttl_hours, timeUnit);
        redisTemplate.opsForValue().set(fullKey, value, ttl_hours, timeUnit);
    }

    @Override
    public Object getCacheValue(String prefix, String key) {
        String fullKey = keyBuilder(prefix, key);
        Object value = redisTemplate.opsForValue().get(fullKey);
        if (value != null) {
            log.debug("CACHE: Hit for key: {}", fullKey);
        } else {
            log.debug("CACHE: Miss for key: {}", fullKey);
        }
        return value;
    }

    @Override
    public void removeCache(String prefix, String key) {
        String fullKey = keyBuilder(prefix, key);
        log.debug("CACHE: Removing key: {}", fullKey);
        redisTemplate.delete(fullKey);
    }

    private String keyBuilder(String prefix, String key) {
        return serviceName + ":" + prefix + ":" + key;
    }
}
