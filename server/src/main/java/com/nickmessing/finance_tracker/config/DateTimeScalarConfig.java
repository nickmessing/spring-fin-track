package com.nickmessing.finance_tracker.config;

import graphql.GraphQLContext;
import graphql.execution.CoercedVariables;
import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.time.Instant;
import java.time.format.DateTimeParseException;

@Configuration
public class DateTimeScalarConfig {

    @Bean
    public RuntimeWiringConfigurer dateTimeWiringConfigurer() {
        GraphQLScalarType dateTimeScalar = GraphQLScalarType.newScalar()
                .name("DateTime")
                .description("ISO-8601 date-time")
                .coercing(new Coercing<Instant, String>() {
                    @Override
                    public String serialize(Object dataFetcherResult, GraphQLContext context, java.util.Locale locale)
                            throws CoercingSerializeException {
                        if (dataFetcherResult instanceof Instant instant) {
                            return instant.toString();
                        }
                        throw new CoercingSerializeException("Expected an Instant object");
                    }

                    @Override
                    public Instant parseValue(Object input, GraphQLContext context, java.util.Locale locale)
                            throws CoercingParseValueException {
                        try {
                            return Instant.parse(input.toString());
                        } catch (DateTimeParseException e) {
                            throw new CoercingParseValueException("Invalid DateTime value: " + e.getMessage());
                        }
                    }

                    @Override
                    public Instant parseLiteral(Value<?> input, CoercedVariables variables,
                            GraphQLContext context, java.util.Locale locale)
                            throws CoercingParseLiteralException {
                        if (input instanceof StringValue stringValue) {
                            try {
                                return Instant.parse(stringValue.getValue());
                            } catch (DateTimeParseException e) {
                                throw new CoercingParseLiteralException("Invalid DateTime literal: " + e.getMessage());
                            }
                        }
                        throw new CoercingParseLiteralException("Expected a StringValue");
                    }
                })
                .build();

        return wiringBuilder -> wiringBuilder.scalar(dateTimeScalar);
    }
}
