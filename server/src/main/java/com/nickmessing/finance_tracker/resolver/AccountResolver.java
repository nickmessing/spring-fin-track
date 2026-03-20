package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.Account;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import com.nickmessing.finance_tracker.resolver.common.NamedCursor;
import com.nickmessing.finance_tracker.resolver.common.PageInfo;
import com.nickmessing.finance_tracker.resolver.common.PaginationUtil;
import com.nickmessing.finance_tracker.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.Currency;
import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class AccountResolver {

    public record CreateAccountInput(UUID id, String icon, String name, Currency currency, long initialBalance) {}

    public record UpdateAccountInput(UUID id, String icon, String name, Long initialBalance) {}

    public record AccountEdge(Account node, String cursor) {}

    public record AccountConnection(List<AccountEdge> edges, PageInfo pageInfo) {}

    private final AccountService accountService;

    @QueryMapping
    public Account account(@Argument UUID id) {
        return accountService.findById(AuthUtil.currentUserId(), id);
    }

    @QueryMapping
    public AccountConnection accounts(
            @Argument Integer first,
            @Argument String after) {
        UUID userId = AuthUtil.currentUserId();
        int limit = PaginationUtil.resolveFirst(first);

        NamedCursor cursor = after != null ? NamedCursor.deserialize(after) : null;

        List<Account> results = accountService.findPage(userId, cursor, limit + 1);
        boolean hasNextPage = results.size() > limit;
        List<Account> page = hasNextPage ? results.subList(0, limit) : results;

        List<AccountEdge> edges = page.stream()
                .map(a -> new AccountEdge(a, NamedCursor.from(a).serialize()))
                .toList();

        PageInfo pageInfo = new PageInfo(
                hasNextPage,
                edges.isEmpty() ? null : edges.getLast().cursor());

        return new AccountConnection(edges, pageInfo);
    }

    @SchemaMapping(typeName = "Account", field = "balance")
    public long balance(Account account) {
        // TODO: add proper balance calculation based on transactions
        return account.getInitialBalance();
    }

    @MutationMapping
    public Account createAccount(@Argument CreateAccountInput input) {
        return accountService.create(
                AuthUtil.currentUserId(),
                input.id(),
                input.icon(),
                input.name(),
                input.currency(),
                input.initialBalance());
    }

    @MutationMapping
    public Account updateAccount(@Argument UpdateAccountInput input) {
        return accountService
                .update(AuthUtil.currentUserId(), input.id(), input.icon(), input.name(), input.initialBalance());
    }

    @MutationMapping
    public boolean deleteAccount(@Argument UUID id, @Argument UUID mergeIntoId) {
        return accountService.delete(AuthUtil.currentUserId(), id, mergeIntoId);
    }
}
