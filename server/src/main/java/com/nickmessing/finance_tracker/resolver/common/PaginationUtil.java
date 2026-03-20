package com.nickmessing.finance_tracker.resolver.common;

public class PaginationUtil {

    public static final int DEFAULT_PAGE_SIZE = 50;
    public static final int MAX_PAGE_SIZE = 200;

    private PaginationUtil() {}

    public static int resolveFirst(Integer first) {
        if (first == null) {
            return DEFAULT_PAGE_SIZE;
        }
        if (first < 1) {
            throw new IllegalArgumentException("first must be at least 1");
        }
        if (first > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("first must be at most " + MAX_PAGE_SIZE);
        }
        return first;
    }
}
