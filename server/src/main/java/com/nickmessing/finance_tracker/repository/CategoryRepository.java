package com.nickmessing.finance_tracker.repository;

import com.nickmessing.finance_tracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    @Query("""
            SELECT c FROM Category c WHERE c.user.id = :userId AND c.kind = :kind
            AND (LOWER(c.name), c.id) > (LOWER(:afterName), :afterId)
            ORDER BY LOWER(c.name), c.id""")
    List<Category> findByUserIdAndKindAfterCursor(UUID userId, Category.Kind kind, String afterName, UUID afterId, org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT c FROM Category c WHERE c.user.id = :userId AND c.kind = :kind
            ORDER BY LOWER(c.name), c.id""")
    List<Category> findByUserIdAndKind(UUID userId, Category.Kind kind, org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT c FROM Category c WHERE c.user.id = :userId
            AND (LOWER(c.name), c.id) > (LOWER(:afterName), :afterId)
            ORDER BY LOWER(c.name), c.id""")
    List<Category> findByUserIdAfterCursor(UUID userId, String afterName, UUID afterId, org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT c FROM Category c WHERE c.user.id = :userId
            ORDER BY LOWER(c.name), c.id""")
    List<Category> findByUserId(UUID userId, org.springframework.data.domain.Pageable pageable);

    Optional<Category> findByIdAndUserId(UUID id, UUID userId);
}
