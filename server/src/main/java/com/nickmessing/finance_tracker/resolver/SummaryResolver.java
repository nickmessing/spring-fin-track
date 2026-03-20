package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.Category;
import com.nickmessing.finance_tracker.repository.TransactionRepository;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class SummaryResolver {

    public record CategoryTotal(Category category, long total) {}

    public record Summary(long totalIncome, long totalExpense, List<CategoryTotal> byCategory) {}

    private final TransactionRepository transactionRepository;

    @QueryMapping
    public Summary summary(@Argument Instant from, @Argument Instant to) {
        var userId = AuthUtil.currentUserId();

        long totalIncome = transactionRepository.sumIncome(userId, from, to);
        long totalExpense = transactionRepository.sumExpense(userId, from, to);

        List<CategoryTotal> byCategory = transactionRepository.sumByCategory(userId, from, to).stream()
                .map(row -> new CategoryTotal((Category) row[0], (long) row[1]))
                .toList();

        return new Summary(totalIncome, totalExpense, byCategory);
    }
}
