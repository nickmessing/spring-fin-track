package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.Transaction;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import com.nickmessing.finance_tracker.resolver.common.IdCursor;
import com.nickmessing.finance_tracker.resolver.common.PageInfo;
import com.nickmessing.finance_tracker.resolver.common.PaginationUtil;
import com.nickmessing.finance_tracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class TransactionResolver {

    public record CreateTransactionInput(
            UUID id,
            Transaction.Kind kind,
            long amount,
            Long destinationAmount,
            String description,
            UUID accountId,
            UUID destinationAccountId,
            UUID categoryId) {}

    public record UpdateTransactionInput(
            UUID id,
            Long amount,
            Long destinationAmount,
            String description,
            UUID accountId,
            UUID destinationAccountId,
            UUID categoryId) {}

    public record TransactionFilterInput(Instant from, Instant to) {}

    public record TransactionFilter(Instant from, Instant to) {}

    public record TransactionEdge(Transaction node, String cursor) {}

    public record TransactionConnection(TransactionFilter filter, List<TransactionEdge> edges, PageInfo pageInfo) {}

    private final TransactionService transactionService;

    @QueryMapping
    public Transaction transaction(@Argument UUID id) {
        return transactionService.findById(AuthUtil.currentUserId(), id);
    }

    @QueryMapping
    public TransactionConnection transactions(
            @Argument TransactionFilterInput filter,
            @Argument Integer first,
            @Argument String after) {
        UUID userId = AuthUtil.currentUserId();
        int limit = PaginationUtil.resolveFirst(first);

        Instant from = filter != null ? filter.from() : null;
        Instant to = filter != null ? filter.to() : null;

        IdCursor cursor = after != null ? IdCursor.deserialize(after) : null;

        List<Transaction> results = transactionService.findPage(userId, cursor, from, to, limit + 1);
        boolean hasNextPage = results.size() > limit;
        List<Transaction> page = hasNextPage ? results.subList(0, limit) : results;

        List<TransactionEdge> edges = page.stream()
                .map(t -> new TransactionEdge(t, IdCursor.from(t.getId()).serialize()))
                .toList();

        PageInfo pageInfo = new PageInfo(
                hasNextPage,
                edges.isEmpty() ? null : edges.getLast().cursor());

        return new TransactionConnection(new TransactionFilter(from, to), edges, pageInfo);
    }

    @MutationMapping
    public Transaction createTransaction(@Argument CreateTransactionInput input) {
        return transactionService.create(
                AuthUtil.currentUserId(),
                input.id(),
                input.kind(),
                input.amount(),
                input.destinationAmount(),
                input.description(),
                input.accountId(),
                input.destinationAccountId(),
                input.categoryId());
    }

    @MutationMapping
    public Transaction updateTransaction(@Argument UpdateTransactionInput input) {
        return transactionService.update(
                AuthUtil.currentUserId(),
                input.id(),
                input.amount(),
                input.destinationAmount(),
                input.description(),
                input.accountId(),
                input.destinationAccountId(),
                input.categoryId());
    }

    @MutationMapping
    public boolean deleteTransaction(@Argument UUID id) {
        return transactionService.delete(AuthUtil.currentUserId(), id);
    }
}
