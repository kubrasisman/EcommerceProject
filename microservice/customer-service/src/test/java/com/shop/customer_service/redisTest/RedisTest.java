package com.shop.customer_service.redisTest;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;


public class RedisTest {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostConstruct
    public void testRedisConnection() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            System.out.println("✅ Redis connection successful!");
        } catch (Exception e) {
            System.out.println("Redis connection unsuccessfull!");
            e.printStackTrace();
        }
    }
}