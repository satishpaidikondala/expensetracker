package com.example.expensetracker.app.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
public class SessionService {
    private final StringRedisTemplate redis;
    public SessionService(StringRedisTemplate redis) { this.redis = redis; }

    public String createSession(String userId) {
        String token = UUID.randomUUID().toString();
        try { redis.opsForValue().set("sess:" + token, userId, Duration.ofHours(24)); } catch (Exception ignored) {}
        return token;
    }
    public String validate(String token) {
        if (token == null) return null;
        try { return redis.opsForValue().get("sess:" + token); } catch (Exception e) { return null; }
    }
    public void invalidate(String token) {
        try { redis.delete("sess:" + token); } catch (Exception ignored) {}
    }
}
