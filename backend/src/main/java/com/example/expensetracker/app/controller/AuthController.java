package com.example.expensetracker.app.controller;

import com.example.expensetracker.app.service.AuthService;
import com.example.expensetracker.app.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final SessionService sessions;

    public AuthController(AuthService authService, SessionService sessions) {
        this.authService = authService;
        this.sessions = sessions;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        return ResponseEntity.ok(authService.login(email, password));
    }

    @PostMapping(path = {"/register", "/signup"})
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        return ResponseEntity.ok(authService.register(name, email, password));
    }

    @PostMapping(path = {"/google", "/social"})
    public ResponseEntity<Map<String, Object>> socialAuth(@RequestBody Map<String, String> body) {
        String provider = body.getOrDefault("provider", "Google");
        String email = body.get("email");
        String name = body.get("name");
        String avatarUrl = body.get("avatarUrl");
        return ResponseEntity.ok(authService.socialLogin(provider, email, name, avatarUrl));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(auth.substring(7)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth != null && auth.startsWith("Bearer ")) {
            sessions.invalidate(auth.substring(7));
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(@RequestHeader(value = "Authorization", required = false) String auth) {
        String uid = auth != null && auth.startsWith("Bearer ") ? sessions.validate(auth.substring(7)) : null;
        return ResponseEntity.ok(Map.of("valid", uid != null, "userId", uid != null ? uid : ""));
    }
}

