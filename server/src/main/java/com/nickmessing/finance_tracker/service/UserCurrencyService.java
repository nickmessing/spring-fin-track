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
        return accountRepository.findDistinctCurrenciesByUserId(userId).stream()
                .map(Currency::getInstance)
                .toList();
    }

    /**
     * Compute rate for a currency relative to the user's default currency.
     * Uses avg from transfers this week, falls back to last transfer ever, falls back to 0.
     */
    public double computeRate(UUID userId, Currency userDefault, Currency target) {
        if (userDefault.equals(target)) {
            return 1.0;
        }

        String targetCode = target.getCurrencyCode();
        String defaultCode = userDefault.getCurrencyCode();

        // Try this week's transfers
        Instant weekStart = Instant.now()
                .atOffset(ZoneOffset.UTC)
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .toLocalDate()
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);

        List<Transaction> weekTransfers = transactionRepository
                .findTransfersInvolvingCurrencySince(userId, targetCode, weekStart);

        List<Double> rates = weekTransfers.stream()
                .map(t -> extractRate(t, defaultCode, targetCode))
                .filter(r -> r != null)
                .toList();

        if (!rates.isEmpty()) {
            return rates.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        }

        // Fall back to last transfer ever
        List<Transaction> lastTransfer = transactionRepository
                .findTransfersInvolvingCurrency(userId, targetCode, PageRequest.of(0, 1));

        if (!lastTransfer.isEmpty()) {
            Double rate = extractRate(lastTransfer.getFirst(), defaultCode, targetCode);
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
    private Double extractRate(Transaction t, String defaultCode, String targetCode) {
        String srcCurrency = t.getAccount().getCurrency().getCurrencyCode();
        String dstCurrency = t.getDestinationAccount().getCurrency().getCurrencyCode();
        long srcAmount = t.getAmount();
        long dstAmount = t.getDestinationAmount() != null ? t.getDestinationAmount() : srcAmount;

        if (srcCurrency.equals(targetCode) && dstCurrency.equals(defaultCode)) {
            // target -> default: rate = dstAmount / srcAmount
            return (double) dstAmount / srcAmount;
        } else if (srcCurrency.equals(defaultCode) && dstCurrency.equals(targetCode)) {
            // default -> target: rate = srcAmount / dstAmount
            return (double) srcAmount / dstAmount;
        }
        return null;
    }
}
