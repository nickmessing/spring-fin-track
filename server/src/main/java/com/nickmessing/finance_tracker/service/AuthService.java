package com.nickmessing.finance_tracker.service;

import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Currency;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResult signUp(String email, String password, String displayName, Currency defaultCurrency) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setDefaultCurrency(defaultCurrency);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId());
        return new AuthResult(token, user);
    }

    public AuthResult signIn(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResult(token, user);
    }

    public record AuthResult(String token, User user) {}
}
