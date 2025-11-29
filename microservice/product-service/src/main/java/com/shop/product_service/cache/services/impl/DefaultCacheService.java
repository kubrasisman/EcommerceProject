package com.shop.product_service.cache.services.impl;

import com.shop.product_service.cache.services.CacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
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
        redisTemplate.opsForValue().set(keyBuilder(prefix, key), value, ttl_hours, timeUnit);
    }

    @Override
    public Object getCacheValue(String prefix, String key) {
        return redisTemplate.opsForValue().get(keyBuilder(prefix, key));
    }

    @Override
    public void removeCache(String prefix, String key) {
        redisTemplate.delete(keyBuilder(prefix, key));
    }

    private String keyBuilder(String prefix, String key) {
        return serviceName + ":" + prefix + ":" + key;
    }
}
