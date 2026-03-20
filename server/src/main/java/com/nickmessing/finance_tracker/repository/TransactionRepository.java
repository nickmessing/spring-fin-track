package com.nickmessing.finance_tracker.repository;

import com.nickmessing.finance_tracker.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.id < :afterId
            AND (:from IS NULL OR t.createdAt >= :from)
            AND (:to IS NULL OR t.createdAt <= :to)
            ORDER BY t.id DESC""")
    List<Transaction> findByUserIdAfterCursor(UUID userId, UUID afterId, Instant from, Instant to, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId
            AND (:from IS NULL OR t.createdAt >= :from)
            AND (:to IS NULL OR t.createdAt <= :to)
            ORDER BY t.id DESC""")
    List<Transaction> findByUserId(UUID userId, Instant from, Instant to, Pageable pageable);

    Optional<Transaction> findByIdAndUserId(UUID id, UUID userId);

    @Query("""
            SELECT COALESCE(SUM(CASE
                WHEN t.kind = 'INCOME' THEN t.amount
                WHEN t.kind = 'EXPENSE' THEN -t.amount
                WHEN t.kind = 'TRANSFER' THEN -t.amount
                ELSE 0 END), 0)
            FROM Transaction t WHERE t.account.id = :accountId""")
    long sumForAccount(UUID accountId);

    @Query("""
            SELECT COALESCE(SUM(CASE
                WHEN t.destinationAmount IS NOT NULL THEN t.destinationAmount
                ELSE t.amount END), 0)
            FROM Transaction t WHERE t.destinationAccount.id = :accountId AND t.kind = 'TRANSFER'""")
    long sumTransfersIntoAccount(UUID accountId);

    @Modifying
    @Query("UPDATE Transaction t SET t.category.id = :targetId WHERE t.category.id = :sourceId AND t.user.id = :userId")
    void reassignCategory(UUID sourceId, UUID targetId, UUID userId);

    @Modifying
    @Query("""
            UPDATE Transaction t SET t.account.id = :targetId
            WHERE t.account.id = :sourceId AND t.user.id = :userId""")
    void reassignAccount(UUID sourceId, UUID targetId, UUID userId);

    @Modifying
    @Query("""
            UPDATE Transaction t SET t.destinationAccount.id = :targetId
            WHERE t.destinationAccount.id = :sourceId AND t.user.id = :userId""")
    void reassignDestinationAccount(UUID sourceId, UUID targetId, UUID userId);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
            WHERE t.user.id = :userId AND t.kind = 'INCOME'
            AND (:from IS NULL OR t.createdAt >= :from) AND (:to IS NULL OR t.createdAt <= :to)""")
    long sumIncome(UUID userId, Instant from, Instant to);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
            WHERE t.user.id = :userId AND t.kind = 'EXPENSE'
            AND (:from IS NULL OR t.createdAt >= :from) AND (:to IS NULL OR t.createdAt <= :to)""")
    long sumExpense(UUID userId, Instant from, Instant to);

    @Query("""
            SELECT t.category, SUM(t.amount) FROM Transaction t
            WHERE t.user.id = :userId AND t.kind IN ('INCOME', 'EXPENSE')
            AND (:from IS NULL OR t.createdAt >= :from) AND (:to IS NULL OR t.createdAt <= :to)
            GROUP BY t.category ORDER BY SUM(t.amount) DESC""")
    List<Object[]> sumByCategory(UUID userId, Instant from, Instant to);

    @Query("""
            SELECT COALESCE(SUM(CASE
                WHEN t.kind = 'INCOME' THEN t.amount
                WHEN t.kind = 'EXPENSE' THEN -t.amount
                WHEN t.kind = 'TRANSFER' THEN -t.amount
                ELSE 0 END), 0)
            FROM Transaction t WHERE t.account.id = :accountId AND t.createdAt < :before""")
    long sumForAccountBefore(UUID accountId, Instant before);

    @Query("""
            SELECT COALESCE(SUM(CASE
                WHEN t.destinationAmount IS NOT NULL THEN t.destinationAmount
                ELSE t.amount END), 0)
            FROM Transaction t WHERE t.destinationAccount.id = :accountId AND t.kind = 'TRANSFER'
            AND t.createdAt < :before""")
    long sumTransfersIntoAccountBefore(UUID accountId, Instant before);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.account.id = :accountId
            AND t.createdAt >= :from AND t.createdAt <= :to
            ORDER BY t.createdAt ASC""")
    List<Transaction> findByAccountIdInRange(UUID accountId, Instant from, Instant to);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.destinationAccount.id = :accountId AND t.kind = 'TRANSFER'
            AND t.createdAt >= :from AND t.createdAt <= :to
            ORDER BY t.createdAt ASC""")
    List<Transaction> findTransfersIntoAccountInRange(UUID accountId, Instant from, Instant to);

    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.kind = 'TRANSFER'
            AND t.account.currency != t.destinationAccount.currency
            AND (t.account.currency = :currency OR t.destinationAccount.currency = :currency)
            AND t.createdAt >= :since
            ORDER BY t.createdAt DESC""")
    List<Transaction> findTransfersInvolvingCurrencySince(UUID userId, String currency, Instant since);

    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.kind = 'TRANSFER'
            AND t.account.currency != t.destinationAccount.currency
            AND (t.account.currency = :currency OR t.destinationAccount.currency = :currency)
            ORDER BY t.createdAt DESC""")
    List<Transaction> findTransfersInvolvingCurrency(UUID userId, String currency, Pageable pageable);
}
