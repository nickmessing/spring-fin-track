package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.UserRepository;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import com.nickmessing.finance_tracker.service.UserCurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.Currency;
import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class UserResolver {

    public record UserCurrency(Currency code, Currency info, double rate) {}

    private final UserRepository userRepository;
    private final UserCurrencyService userCurrencyService;

    @QueryMapping
    public User me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UUID userId)) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }

    @SchemaMapping(typeName = "User", field = "balance")
    public long balance(User user) {
        return userCurrencyService.computeUserBalance(user.getId(), user.getDefaultCurrency());
    }

    @SchemaMapping(typeName = "User", field = "currencies")
    public List<UserCurrency> currencies(User user) {
        return userCurrencyService.findUserCurrencies(user.getId()).stream()
                .map(currency -> new UserCurrency(
                        currency,
                        currency,
                        userCurrencyService.computeRate(user.getId(), user.getDefaultCurrency(), currency)))
                .toList();
    }

    @MutationMapping
    public User updateDefaultCurrency(@Argument Currency currency) {
        UUID userId = AuthUtil.currentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setDefaultCurrency(currency);
        return userRepository.save(user);
    }
}
