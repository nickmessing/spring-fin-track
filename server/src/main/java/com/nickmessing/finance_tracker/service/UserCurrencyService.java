package com.nickmessing.finance_tracker.service;

import com.nickmessing.finance_tracker.entity.Account;
import com.nickmessing.finance_tracker.entity.Transaction;
import com.nickmessing.finance_tracker.repository.AccountRepository;
import com.nickmessing.finance_tracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.Currency;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserCurrencyService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public List<Currency> findUserCurrencies(UUID userId) {
        return accountRepository.findDistinctCurrenciesByUserId(userId);
    }

    /**
     * Compute rate for a currency relative to the user's default currency.
     * Uses avg from transfers this week, falls back to last transfer ever, falls back to 0.
     */
    public double computeRate(UUID userId, Currency userDefault, Currency target) {
        if (userDefault.equals(target)) {
            return 1.0;
        }

        // Try this week's transfers
        Instant weekStart = Instant.now()
                .atOffset(ZoneOffset.UTC)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .toLocalDate()
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);

        List<Transaction> weekTransfers = transactionRepository
                .findTransfersInvolvingCurrencySince(userId, target, weekStart);

        List<Double> rates = weekTransfers.stream()
                .map(t -> extractRate(t, userDefault, target))
                .filter(r -> r != null)
                .toList();

        if (!rates.isEmpty()) {
            return rates.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        }

        // Fall back to last transfer ever
        List<Transaction> lastTransfer = transactionRepository
                .findTransfersInvolvingCurrency(userId, target, PageRequest.of(0, 1));

        if (!lastTransfer.isEmpty()) {
            Double rate = extractRate(lastTransfer.getFirst(), userDefault, target);
            if (rate != null) {
                return rate;
            }
        }

        return 0.0;
    }

    public long computeUserBalance(UUID userId, Currency defaultCurrency) {
        List<Account> accounts = accountRepository.findAllByUserId(userId);
        long total = 0;
        for (Account account : accounts) {
            long accountBalance = account.getInitialBalance()
                    + transactionService.computeBalance(account.getId());
            if (account.getCurrency().equals(defaultCurrency)) {
                total += accountBalance;
            } else {
                double rate = computeRate(userId, defaultCurrency, account.getCurrency());
                if (rate > 0) {
                    total += Math.round(accountBalance / rate);
                }
            }
        }
        return total;
    }

    /**
     * Extract the rate of targetCurrency in terms of defaultCurrency from a transfer.
     * Rate = how many units of defaultCurrency per 1 unit of targetCurrency (in minor units).
     */
    private Double extractRate(Transaction t, Currency defaultCurrency, Currency targetCurrency) {
        Currency srcCurrency = t.getAccount().getCurrency();
        Currency dstCurrency = t.getDestinationAccount().getCurrency();
        long srcAmount = t.getAmount();
        long dstAmount = t.getDestinationAmount() != null ? t.getDestinationAmount() : srcAmount;

        if (srcCurrency.equals(targetCurrency) && dstCurrency.equals(defaultCurrency)) {
            // target -> default: rate = dstAmount / srcAmount
            return (double) dstAmount / srcAmount;
        } else if (srcCurrency.equals(defaultCurrency) && dstCurrency.equals(targetCurrency)) {
            // default -> target: rate = srcAmount / dstAmount
            return (double) srcAmount / dstAmount;
        }
        return null;
    }
}
