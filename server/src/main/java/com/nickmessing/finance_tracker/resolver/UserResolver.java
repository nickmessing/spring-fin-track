package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class UserResolver {

    private final UserRepository userRepository;

    @QueryMapping
    public User me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }
}
