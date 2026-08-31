package com.example.expensetracker.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class AiParserClient {
    private final WebClient webClient;
    public AiParserClient(@Value("${ai.parser.url:http://ai-parser:8000}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }
    @SuppressWarnings("unchecked")
    public Map<String,Object> parse(String text) {
        try {
            return webClient.post().uri("/parse").bodyValue(Map.of("text", text))
                    .retrieve().bodyToMono(Map.class).block();
        } catch (Exception e) {
            return Map.of("amount", 0, "category", "Other", "date", java.time.LocalDate.now().toString(), "description", text);
        }
    }
}
