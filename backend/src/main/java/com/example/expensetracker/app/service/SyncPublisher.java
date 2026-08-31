package com.example.expensetracker.app.service;

import com.example.expensetracker.app.config.RabbitConfig;
import com.example.expensetracker.app.model.Expense;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SyncPublisher {
    private final RabbitTemplate rabbit;
    public SyncPublisher(@Autowired(required = false) RabbitTemplate rabbit) { this.rabbit = rabbit; }

    public void publish(Expense e) {
        if (rabbit == null) return;
        try {
            Map<String,Object> msg = Map.of(
                "id", e.getId(),
                "amount", e.getAmount(),
                "category", e.getCategory(),
                "date", e.getDate().toString(),
                "userId", e.getUserId()
            );
            rabbit.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.ROUTING, msg);
        } catch (Exception ignored) {
            // core API unaffected if broker down (doc guarantee)
        }
    }
}
