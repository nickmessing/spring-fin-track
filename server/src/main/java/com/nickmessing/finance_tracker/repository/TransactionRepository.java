package com.nickmessing.finance_tracker.repository;

import com.nickmessing.finance_tracker.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.id < :afterId
            ORDER BY t.id DESC""")
    List<Transaction> findByUserIdAfterCursor(UUID userId, UUID afterId, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t WHERE t.user.id = :userId
            ORDER BY t.id DESC""")
    List<Transaction> findByUserId(UUID userId, Pageable pageable);

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
}
