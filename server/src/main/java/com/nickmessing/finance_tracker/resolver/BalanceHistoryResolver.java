package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.Account;
import com.nickmessing.finance_tracker.entity.Transaction;
import com.nickmessing.finance_tracker.repository.AccountRepository;
import com.nickmessing.finance_tracker.repository.TransactionRepository;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class BalanceHistoryResolver {

    public enum Granularity {
        DAY, WEEK, MONTH
    }

    public record BalancePoint(Instant date, long balance) {}

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @QueryMapping
    public List<BalancePoint> accountBalanceHistory(
            @Argument UUID accountId,
            @Argument Granularity granularity,
            @Argument Instant from,
            @Argument Instant to) {
        UUID userId = AuthUtil.currentUserId();
        Account account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Get balance before the "from" date as starting point
        long balanceBeforeRange = account.getInitialBalance()
                + computeBalanceBefore(accountId, from);

        List<Transaction> txsInRange = transactionRepository.findByAccountIdInRange(accountId, from, to);
        List<Transaction> transfersIn = transactionRepository.findTransfersIntoAccountInRange(accountId, from, to);

        // Build time buckets
        List<Instant> buckets = buildBuckets(from, to, granularity);
        List<BalancePoint> points = new ArrayList<>();

        long runningBalance = balanceBeforeRange;
        int txIdx = 0;
        int trIdx = 0;

        for (Instant bucketEnd : buckets) {
            // Add transactions up to this bucket
            while (txIdx < txsInRange.size() && !txsInRange.get(txIdx).getCreatedAt().isAfter(bucketEnd)) {
                runningBalance += transactionEffect(txsInRange.get(txIdx));
                txIdx++;
            }
            while (trIdx < transfersIn.size() && !transfersIn.get(trIdx).getCreatedAt().isAfter(bucketEnd)) {
                Transaction t = transfersIn.get(trIdx);
                runningBalance += t.getDestinationAmount() != null ? t.getDestinationAmount() : t.getAmount();
                trIdx++;
            }
            points.add(new BalancePoint(bucketEnd, runningBalance));
        }

        return points;
    }

    private long computeBalanceBefore(UUID accountId, Instant before) {
        return transactionRepository.sumForAccountBefore(accountId, before)
                + transactionRepository.sumTransfersIntoAccountBefore(accountId, before);
    }

    private long transactionEffect(Transaction t) {
        return switch (t.getKind()) {
            case INCOME -> t.getAmount();
            case EXPENSE -> -t.getAmount();
            case TRANSFER -> -t.getAmount();
        };
    }

    private List<Instant> buildBuckets(Instant from, Instant to, Granularity granularity) {
        List<Instant> buckets = new ArrayList<>();
        LocalDate current = from.atOffset(ZoneOffset.UTC).toLocalDate();
        LocalDate end = to.atOffset(ZoneOffset.UTC).toLocalDate();

        while (!current.isAfter(end)) {
            LocalDate bucketEnd = switch (granularity) {
                case DAY -> current;
                case WEEK -> current.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));
                case MONTH -> current.with(TemporalAdjusters.lastDayOfMonth());
            };
            if (bucketEnd.isAfter(end)) {
                bucketEnd = end;
            }
            buckets.add(bucketEnd.atTime(23, 59, 59).toInstant(ZoneOffset.UTC));

            current = switch (granularity) {
                case DAY -> current.plusDays(1);
                case WEEK -> current.plusWeeks(1);
                case MONTH -> current.plusMonths(1).withDayOfMonth(1);
            };
        }

        return buckets;
    }
}
