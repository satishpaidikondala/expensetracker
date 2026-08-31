package com.example.expensetracker.app.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "sync.exchange";
    public static final String QUEUE = "sync.queue";
    public static final String ROUTING = "sync.routing";

    @Bean public TopicExchange exchange() { return new TopicExchange(EXCHANGE, true, false); }
    @Bean public Queue queue() { return QueueBuilder.durable(QUEUE).build(); }
    @Bean public Binding binding(Queue queue, TopicExchange exchange) { return BindingBuilder.bind(queue).to(exchange).with(ROUTING); }
}
