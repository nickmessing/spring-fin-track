package com.nickmessing.finance_tracker.repository;

import com.nickmessing.finance_tracker.entity.Account;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    @Query("""
            SELECT a FROM Account a WHERE a.user.id = :userId
            AND (LOWER(a.name), a.id) > (LOWER(:afterName), :afterId)
            ORDER BY LOWER(a.name), a.id""")
    List<Account> findByUserIdAfterCursor(UUID userId, String afterName, UUID afterId, Pageable pageable);

    @Query("""
            SELECT a FROM Account a WHERE a.user.id = :userId
            ORDER BY LOWER(a.name), a.id""")
    List<Account> findByUserId(UUID userId, Pageable pageable);

    Optional<Account> findByIdAndUserId(UUID id, UUID userId);
}
