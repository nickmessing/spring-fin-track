package com.nickmessing.finance_tracker.service;

import com.nickmessing.finance_tracker.entity.Category;
import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.CategoryRepository;
import com.nickmessing.finance_tracker.repository.UserRepository;
import com.nickmessing.finance_tracker.resolver.common.NamedCursor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Category> findPage(UUID userId, Category.Kind kind, NamedCursor after, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        if (after != null) {
            if (kind != null) {
                return categoryRepository
                        .findByUserIdAndKindAfterCursor(userId, kind, after.name(), after.id(), pageable);
            }
            return categoryRepository.findByUserIdAfterCursor(userId, after.name(), after.id(), pageable);
        }
        if (kind != null) {
            return categoryRepository.findByUserIdAndKind(userId, kind, pageable);
        }
        return categoryRepository.findByUserId(userId, pageable);
    }

    public Category findById(UUID userId, UUID id) {
        return categoryRepository.findByIdAndUserId(id, userId).orElse(null);
    }

    @Transactional
    public Category create(UUID userId, UUID id, Category.Kind kind, String icon, String name) {
        User user = userRepository.getReferenceById(userId);
        Category category = new Category();
        if (id != null) {
            category.setId(id);
        }
        category.setKind(kind);
        category.setIcon(icon);
        category.setName(name);
        category.setUser(user);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(UUID userId, UUID id, String icon, String name) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (icon != null) {
            category.setIcon(icon);
        }
        if (name != null) {
            category.setName(name);
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public boolean delete(UUID userId, UUID id, UUID mergeIntoId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // TODO: if mergeIntoId != null, reassign transactions to target

        categoryRepository.delete(category);
        return true;
    }
}
