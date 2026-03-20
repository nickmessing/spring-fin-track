package com.nickmessing.finance_tracker.resolver;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Currency;
import java.util.List;

@Controller
public class CurrencyQueryResolver {

    @QueryMapping
    public List<Currency> currencies() {
        return Currency.getAvailableCurrencies().stream()
                .sorted((a, b) -> a.getCurrencyCode().compareTo(b.getCurrencyCode()))
                .toList();
    }

    @QueryMapping
    public Currency currency(@Argument Currency code) {
        return code;
    }
}
