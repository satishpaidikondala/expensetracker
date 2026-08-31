package com.example.expensetracker.app.config;

import com.example.expensetracker.app.service.SessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Phase 1+2: Sets PostgreSQL RLS session variable app.current_user_id.
 * Priority: Authorization Bearer -> Redis (<1ms) -> X-User-Id header -> default.
 */
@Component
public class TenantFilter extends OncePerRequestFilter {

    private final SessionService sessions;
    private final DataSource dataSource;

    public TenantFilter(SessionService sessions, @Autowired(required = false) DataSource dataSource) { this.sessions = sessions; this.dataSource = dataSource; }

    private void setConfig(String uid) {
        if (dataSource == null) return;
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT set_config('app.current_user_id', ?, true)")) {
            ps.setString(1, uid);
            ps.execute();
        } catch (Exception ignored) {}
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String userId = null;
        String auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            userId = sessions.validate(auth.substring(7));
        }
        if (userId == null) userId = req.getHeader("X-User-Id");
        if (userId == null || userId.isBlank()) userId = "default";
        req.setAttribute("currentUserId", userId);
        try {
            setConfig(userId);
            chain.doFilter(req, res);
        } finally {
            setConfig("");
        }
    }
}
