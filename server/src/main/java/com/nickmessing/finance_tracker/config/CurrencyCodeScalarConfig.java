package com.nickmessing.finance_tracker.config;

import graphql.GraphQLContext;
import graphql.execution.CoercedVariables;
import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.util.Currency;
import java.util.Locale;

@Configuration
public class CurrencyCodeScalarConfig {

    @Bean
    public RuntimeWiringConfigurer currencyCodeWiringConfigurer() {
        GraphQLScalarType currencyCodeScalar = GraphQLScalarType.newScalar().name("CurrencyCode")
                .description("ISO 4217 currency code (e.g. USD, EUR, MDL)").coercing(new Coercing<Currency, String>() {
                    @Override
                    public String serialize(Object dataFetcherResult, GraphQLContext context, Locale locale)
                            throws CoercingSerializeException {
                        if (dataFetcherResult instanceof Currency currency) {
                            return currency.getCurrencyCode();
                        }
                        if (dataFetcherResult instanceof String s) {
                            return validateAndReturn(s);
                        }
                        throw new CoercingSerializeException("Expected a Currency or String");
                    }

                    @Override
                    public Currency parseValue(Object input, GraphQLContext context, Locale locale)
                            throws CoercingParseValueException {
                        try {
                            return Currency.getInstance(input.toString().toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new CoercingParseValueException("Invalid currency code: " + input);
                        }
                    }

                    @Override
                    public Currency parseLiteral(
                            Value<?> input,
                            CoercedVariables variables,
                            GraphQLContext context,
                            Locale locale) throws CoercingParseLiteralException {
                        if (input instanceof StringValue stringValue) {
                            try {
                                return Currency.getInstance(stringValue.getValue().toUpperCase());
                            } catch (IllegalArgumentException e) {
                                throw new CoercingParseLiteralException(
                                        "Invalid currency code: " + stringValue.getValue());
                            }
                        }
                        throw new CoercingParseLiteralException("Expected a StringValue");
                    }

                    private String validateAndReturn(String code) {
                        try {
                            return Currency.getInstance(code.toUpperCase()).getCurrencyCode();
                        } catch (IllegalArgumentException e) {
                            throw new CoercingSerializeException("Invalid currency code: " + code);
                        }
                    }
                }).build();

        return wiringBuilder -> wiringBuilder.scalar(currencyCodeScalar);
    }
}
