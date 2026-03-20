package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

import java.util.Currency;

@Controller
@RequiredArgsConstructor
public class AuthResolver {

    public record AuthPayload(String token, User user) {}

    public record SignUpInput(String email, String password, String displayName, Currency defaultCurrency) {}

    public record SignInInput(String email, String password) {}

    private final AuthService authService;

    @MutationMapping
    public AuthPayload signUp(@Argument SignUpInput input) {
        AuthService.AuthResult result = authService.signUp(
                input.email(),
                input.password(),
                input.displayName(),
                input.defaultCurrency());
        return new AuthPayload(result.token(), result.user());
    }

    @MutationMapping
    public AuthPayload signIn(@Argument SignInInput input) {
        AuthService.AuthResult result = authService.signIn(input.email(), input.password());
        return new AuthPayload(result.token(), result.user());
    }
}
