package com.nickmessing.finance_tracker.service;

import com.nickmessing.finance_tracker.entity.Account;
import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.AccountRepository;
import com.nickmessing.finance_tracker.repository.UserRepository;
import com.nickmessing.finance_tracker.resolver.common.NamedCursor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Currency;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public List<Account> findPage(UUID userId, NamedCursor after, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        if (after != null) {
            return accountRepository.findByUserIdAfterCursor(userId, after.name(), after.id(), pageable);
        }
        return accountRepository.findByUserId(userId, pageable);
    }

    public Account findById(UUID userId, UUID id) {
        return accountRepository.findByIdAndUserId(id, userId).orElse(null);
    }

    @Transactional
    public Account create(UUID userId, UUID id, String icon, String name, Currency currency, long initialBalance) {
        User user = userRepository.getReferenceById(userId);
        Account account = new Account();
        if (id != null) {
            account.setId(id);
        }
        account.setIcon(icon);
        account.setName(name);
        account.setCurrency(currency);
        account.setInitialBalance(initialBalance);
        account.setUser(user);
        return accountRepository.save(account);
    }

    @Transactional
    public Account update(UUID userId, UUID id, String icon, String name, Long initialBalance) {
        Account account = accountRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (icon != null) {
            account.setIcon(icon);
        }
        if (name != null) {
            account.setName(name);
        }
        if (initialBalance != null) {
            account.setInitialBalance(initialBalance);
        }
        return accountRepository.save(account);
    }

    @Transactional
    public boolean delete(UUID userId, UUID id, UUID mergeIntoId) {
        Account account = accountRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // TODO: if mergeIntoId != null, reassign transactions to target (Task 5)

        accountRepository.delete(account);
        return true;
    }
}
