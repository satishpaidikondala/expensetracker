package com.example.expensetracker.app.service;

import com.example.expensetracker.app.config.RabbitConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GoogleSyncConsumer {

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void handle(Map<String,Object> msg) {
        // Simulate Google Calendar/Tasks sync with retry/rate-limit isolation
        // If Google down, this worker retries independently; core API is unaffected (event-driven)
        try {
            System.out.println("[SyncWorker] Syncing expense " + msg.get("id") + " for user " + msg.get("userId") + " to Google Calendar/Tasks");
            // TODO: OAuth2 Google API call with exponential backoff
            Thread.sleep(50);
        } catch (Exception e) {
            System.err.println("[SyncWorker] retryable error: " + e.getMessage());
            throw new RuntimeException(e); // will be retried via DLQ in production
        }
    }
}
