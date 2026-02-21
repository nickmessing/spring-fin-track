package com.nickmessing.finance_tracker.config;

import graphql.GraphQLContext;
import graphql.execution.CoercedVariables;
import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class DateTimeScalarConfig {

    @Bean
    public RuntimeWiringConfigurer dateTimeWiringConfigurer() {
        GraphQLScalarType dateTimeScalar = GraphQLScalarType.newScalar()
                .name("DateTime")
                .description("ISO-8601 date-time")
                .coercing(new Coercing<OffsetDateTime, String>() {
                    @Override
                    public String serialize(Object dataFetcherResult, GraphQLContext context, java.util.Locale locale)
                            throws CoercingSerializeException {
                        if (dataFetcherResult instanceof OffsetDateTime odt) {
                            return odt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                        }
                        throw new CoercingSerializeException("Expected an OffsetDateTime object");
                    }

                    @Override
                    public OffsetDateTime parseValue(Object input, GraphQLContext context, java.util.Locale locale)
                            throws CoercingParseValueException {
                        try {
                            return OffsetDateTime.parse(input.toString(), DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                        } catch (DateTimeParseException e) {
                            throw new CoercingParseValueException("Invalid DateTime value: " + e.getMessage());
                        }
                    }

                    @Override
                    public OffsetDateTime parseLiteral(Value<?> input, CoercedVariables variables,
                            GraphQLContext context, java.util.Locale locale)
                            throws CoercingParseLiteralException {
                        if (input instanceof StringValue stringValue) {
                            try {
                                return OffsetDateTime.parse(stringValue.getValue(),
                                        DateTimeFormatter.ISO_OFFSET_DATE_TIME);
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
