package com.nickmessing.finance_tracker.resolver.common;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class AuthUtil {

    private AuthUtil() {}

    public static UUID currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            throw new IllegalArgumentException("Authentication required");
        }
        return userId;
    }
}
