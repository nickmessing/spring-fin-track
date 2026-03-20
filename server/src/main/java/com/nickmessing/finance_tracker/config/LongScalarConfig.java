package com.nickmessing.finance_tracker.config;

import graphql.GraphQLContext;
import graphql.execution.CoercedVariables;
import graphql.language.IntValue;
import graphql.language.Value;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.math.BigInteger;
import java.util.Locale;

@Configuration
public class LongScalarConfig {

    @Bean
    public RuntimeWiringConfigurer longWiringConfigurer() {
        GraphQLScalarType longScalar = GraphQLScalarType.newScalar()
                .name("Long")
                .description("64-bit signed integer for minor-unit monetary amounts")
                .coercing(new Coercing<Long, Long>() {
                    @Override
                    public Long serialize(Object dataFetcherResult, GraphQLContext context, Locale locale)
                            throws CoercingSerializeException {
                        if (dataFetcherResult instanceof Long l) {
                            return l;
                        }
                        if (dataFetcherResult instanceof Integer i) {
                            return i.longValue();
                        }
                        if (dataFetcherResult instanceof Number n) {
                            return n.longValue();
                        }
                        throw new CoercingSerializeException("Expected a numeric value");
                    }

                    @Override
                    public Long parseValue(Object input, GraphQLContext context, Locale locale)
                            throws CoercingParseValueException {
                        if (input instanceof Long l) {
                            return l;
                        }
                        if (input instanceof Integer i) {
                            return i.longValue();
                        }
                        if (input instanceof Number n) {
                            return n.longValue();
                        }
                        try {
                            return Long.parseLong(input.toString());
                        } catch (NumberFormatException e) {
                            throw new CoercingParseValueException("Invalid Long value: " + input);
                        }
                    }

                    @Override
                    public Long parseLiteral(Value<?> input, CoercedVariables variables,
                            GraphQLContext context, Locale locale)
                            throws CoercingParseLiteralException {
                        if (input instanceof IntValue intValue) {
                            BigInteger value = intValue.getValue();
                            if (value.compareTo(BigInteger.valueOf(Long.MIN_VALUE)) < 0
                                    || value.compareTo(BigInteger.valueOf(Long.MAX_VALUE)) > 0) {
                                throw new CoercingParseLiteralException("Value out of Long range: " + value);
                            }
                            return value.longValue();
                        }
                        throw new CoercingParseLiteralException("Expected an IntValue");
                    }
                })
                .build();

        return wiringBuilder -> wiringBuilder.scalar(longScalar);
    }
}
