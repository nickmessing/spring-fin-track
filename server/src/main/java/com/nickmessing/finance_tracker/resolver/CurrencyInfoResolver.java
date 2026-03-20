package com.nickmessing.finance_tracker.resolver;

import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.Currency;

@Controller
@SchemaMapping(typeName = "CurrencyInfo")
public class CurrencyInfoResolver {

    @SchemaMapping(field = "code")
    public Currency code(Currency currency) {
        return currency;
    }

    @SchemaMapping(field = "name")
    public String name(Currency currency) {
        return currency.getDisplayName();
    }

    @SchemaMapping(field = "symbol")
    public String symbol(Currency currency) {
        return currency.getSymbol();
    }

    @SchemaMapping(field = "minorUnits")
    public int minorUnits(Currency currency) {
        return currency.getDefaultFractionDigits();
    }
}
