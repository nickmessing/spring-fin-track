package com.nickmessing.finance_tracker.repository;

import com.nickmessing.finance_tracker.entity.Transaction;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.UUID;

public class TransactionSpecs {

    private TransactionSpecs() {}

    public static Specification<Transaction> userId(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Transaction> afterCursor(UUID afterId) {
        return (root, query, cb) -> cb.lessThan(root.get("id"), afterId);
    }

    public static Specification<Transaction> createdFrom(Instant from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), from);
    }

    public static Specification<Transaction> createdTo(Instant to) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), to);
    }
}
