package com.shop.order_service.cache.services;

import java.util.concurrent.TimeUnit;

public interface CacheService {
    void saveCache(String prefix, String key, Object value);
    void saveCache(String prefix, String key,  Object value, long ttl_hours);
    void saveCache(String prefix, String key,  Object value, long ttl_hours, TimeUnit timeUnit);
     Object getCacheValue(String prefix, String key);
    void removeCache(String prefix, String key);
}
