package com.example.expensetracker.app.service;

import com.example.expensetracker.app.model.User;
import com.example.expensetracker.app.repository.UserRepository;
import com.example.expensetracker.app.util.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SessionService sessionService;

    public AuthService(UserRepository userRepository, SessionService sessionService) {
        this.userRepository = userRepository;
        this.sessionService = sessionService;
    }

    public Map<String, Object> register(String name, String email, String password) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid email address is required");
        }
        if (password == null || password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists. Please sign in.");
        }

        String passwordHash = PasswordUtil.hashPassword(password);
        User user = new User(name.trim(), normalizedEmail, passwordHash, "LOCAL");
        user = userRepository.save(user);

        String token = sessionService.createSession(user.getEmail());
        return createAuthResponse(user, token);
    }

    public Map<String, Object> login(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        String normalizedEmail = email.toLowerCase().trim();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if ("GOOGLE".equalsIgnoreCase(user.getProvider()) && user.getPasswordHash() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This account was created with Google Sign-In. Please sign in with Google.");
        }

        if (!PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = sessionService.createSession(user.getEmail());
        return createAuthResponse(user, token);
    }

    public Map<String, Object> socialLogin(String provider, String email, String name, String avatarUrl) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid email is required for social authentication");
        }

        String normalizedEmail = email.toLowerCase().trim();
        String providerName = provider != null ? provider.toUpperCase() : "GOOGLE";
        String displayName = (name != null && !name.isBlank()) ? name.trim() : normalizedEmail.split("@")[0];

        Optional<User> existingUserOpt = userRepository.findByEmail(normalizedEmail);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            user.setLastLoginAt(LocalDateTime.now());
            if (avatarUrl != null && !avatarUrl.isBlank()) user.setAvatarUrl(avatarUrl);
            user = userRepository.save(user);
        } else {
            user = new User(displayName, normalizedEmail, null, providerName);
            if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
            user = userRepository.save(user);
        }

        String token = sessionService.createSession(user.getEmail());
        return createAuthResponse(user, token);
    }

    public Map<String, Object> getCurrentUser(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authorization token provided");
        }
        String email = sessionService.validate(token);
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired session token");
        }

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseGet(() -> {
                    // Fallback for demo or guest tokens
                    User guest = new User("Guest User", email, null, "GUEST");
                    return guest;
                });

        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("name", user.getName());
        res.put("email", user.getEmail());
        res.put("provider", user.getProvider());
        res.put("avatarUrl", user.getAvatarUrl());
        res.put("role", user.getRole());
        res.put("valid", true);
        return res;
    }

    private Map<String, Object> createAuthResponse(User user, String token) {
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("userId", user.getEmail());
        res.put("email", user.getEmail());
        res.put("name", user.getName());
        res.put("provider", user.getProvider());
        res.put("avatarUrl", user.getAvatarUrl());
        res.put("role", user.getRole());
        return res;
    }
}
