package com.nickmessing.finance_tracker.config;

import graphql.GraphQLError;
import graphql.ErrorClassification;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GraphQlExceptionHandler {

    private enum AppErrorType implements ErrorClassification {
        APP_ERROR
    }

    @org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler
    public GraphQLError handle(Exception ex) {
        return GraphQLError.newError()
                .message(ex.getMessage())
                .errorType(AppErrorType.APP_ERROR)
                .build();
    }
}
