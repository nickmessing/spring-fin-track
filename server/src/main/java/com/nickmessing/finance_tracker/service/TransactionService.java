package com.nickmessing.finance_tracker.service;

import com.nickmessing.finance_tracker.entity.Account;
import com.nickmessing.finance_tracker.entity.Category;
import com.nickmessing.finance_tracker.entity.Transaction;
import com.nickmessing.finance_tracker.entity.User;
import com.nickmessing.finance_tracker.repository.AccountRepository;
import com.nickmessing.finance_tracker.repository.CategoryRepository;
import com.nickmessing.finance_tracker.repository.TransactionRepository;
import com.nickmessing.finance_tracker.repository.UserRepository;
import com.nickmessing.finance_tracker.resolver.common.IdCursor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Transaction> findPage(UUID userId, IdCursor after, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        if (after != null) {
            return transactionRepository.findByUserIdAfterCursor(userId, after.id(), pageable);
        }
        return transactionRepository.findByUserId(userId, pageable);
    }

    public Transaction findById(UUID userId, UUID id) {
        return transactionRepository.findByIdAndUserId(id, userId).orElse(null);
    }

    public long computeBalance(UUID accountId) {
        return transactionRepository.sumForAccount(accountId)
                + transactionRepository.sumTransfersIntoAccount(accountId);
    }

    @Transactional
    public Transaction create(
            UUID userId,
            UUID id,
            Transaction.Kind kind,
            long amount,
            Long destinationAmount,
            String description,
            UUID accountId,
            UUID destinationAccountId,
            UUID categoryId) {
        validate(kind, destinationAmount, accountId, destinationAccountId, categoryId);

        User user = userRepository.getReferenceById(userId);
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        Transaction transaction = new Transaction();
        if (id != null) {
            transaction.setId(id);
        }
        transaction.setKind(kind);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setAccount(account);
        transaction.setUser(user);

        if (destinationAccountId != null) {
            Account destAccount = accountRepository.findByIdAndUserId(destinationAccountId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Destination account not found"));
            transaction.setDestinationAccount(destAccount);

            if (destinationAmount != null) {
                transaction.setDestinationAmount(destinationAmount);
            } else if (!account.getCurrency().equals(destAccount.getCurrency())) {
                throw new IllegalArgumentException(
                        "destinationAmount is required for transfers between different currencies");
            } else {
                transaction.setDestinationAmount(amount);
            }
        }

        if (categoryId != null) {
            Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            transaction.setCategory(category);
        }

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction update(
            UUID userId,
            UUID id,
            Long amount,
            Long destinationAmount,
            String description,
            UUID accountId,
            UUID destinationAccountId,
            UUID categoryId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (amount != null) {
            transaction.setAmount(amount);
        }
        if (destinationAmount != null) {
            transaction.setDestinationAmount(destinationAmount);
        }
        if (description != null) {
            transaction.setDescription(description);
        }
        if (accountId != null) {
            Account account = accountRepository.findByIdAndUserId(accountId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Account not found"));
            transaction.setAccount(account);
        }
        if (destinationAccountId != null) {
            Account destAccount = accountRepository.findByIdAndUserId(destinationAccountId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Destination account not found"));
            transaction.setDestinationAccount(destAccount);
        }
        if (categoryId != null) {
            Category category = categoryRepository.findByIdAndUserId(categoryId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            transaction.setCategory(category);
        }

        return transactionRepository.save(transaction);
    }

    @Transactional
    public boolean delete(UUID userId, UUID id) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        transactionRepository.delete(transaction);
        return true;
    }

    @Transactional
    public void reassignCategory(UUID sourceId, UUID targetId, UUID userId) {
        transactionRepository.reassignCategory(sourceId, targetId, userId);
    }

    @Transactional
    public void reassignAccount(UUID sourceId, UUID targetId, UUID userId) {
        transactionRepository.reassignAccount(sourceId, targetId, userId);
        transactionRepository.reassignDestinationAccount(sourceId, targetId, userId);
    }

    private void validate(
            Transaction.Kind kind,
            Long destinationAmount,
            UUID accountId,
            UUID destinationAccountId,
            UUID categoryId) {
        switch (kind) {
            case INCOME, EXPENSE -> {
                if (categoryId == null) {
                    throw new IllegalArgumentException("categoryId is required for " + kind + " transactions");
                }
                if (destinationAccountId != null) {
                    throw new IllegalArgumentException(
                            "destinationAccountId must be null for " + kind + " transactions");
                }
                if (destinationAmount != null) {
                    throw new IllegalArgumentException("destinationAmount must be null for " + kind + " transactions");
                }
            }
            case TRANSFER -> {
                if (categoryId != null) {
                    throw new IllegalArgumentException("categoryId must be null for TRANSFER transactions");
                }
                if (destinationAccountId == null) {
                    throw new IllegalArgumentException("destinationAccountId is required for TRANSFER transactions");
                }
                if (destinationAccountId.equals(accountId)) {
                    throw new IllegalArgumentException("Cannot transfer to the same account");
                }
            }
        }
    }
}
