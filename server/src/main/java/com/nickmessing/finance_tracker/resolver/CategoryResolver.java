package com.nickmessing.finance_tracker.resolver;

import com.nickmessing.finance_tracker.entity.Category;
import com.nickmessing.finance_tracker.resolver.common.AuthUtil;
import com.nickmessing.finance_tracker.resolver.common.NamedCursor;
import com.nickmessing.finance_tracker.resolver.common.PageInfo;
import com.nickmessing.finance_tracker.resolver.common.PaginationUtil;
import com.nickmessing.finance_tracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class CategoryResolver {

    public record CreateCategoryInput(UUID id, Category.Kind kind, String icon, String name) {}

    public record UpdateCategoryInput(UUID id, String icon, String name) {}

    public record CategoryFilterInput(Category.Kind kind) {}

    public record CategoryFilter(Category.Kind kind) {}

    public record CategoryEdge(Category node, String cursor) {}

    public record CategoryConnection(CategoryFilter filter, List<CategoryEdge> edges, PageInfo pageInfo) {}

    private final CategoryService categoryService;

    @QueryMapping
    public Category category(@Argument UUID id) {
        return categoryService.findById(AuthUtil.currentUserId(), id);
    }

    @QueryMapping
    public CategoryConnection categories(
            @Argument CategoryFilterInput filter,
            @Argument Integer first,
            @Argument String after) {
        UUID userId = AuthUtil.currentUserId();
        int limit = PaginationUtil.resolveFirst(first);
        Category.Kind kind = filter != null ? filter.kind() : null;

        NamedCursor cursor = after != null ? NamedCursor.deserialize(after) : null;

        List<Category> results = categoryService.findPage(userId, kind, cursor, limit + 1);
        boolean hasNextPage = results.size() > limit;
        List<Category> page = hasNextPage ? results.subList(0, limit) : results;

        List<CategoryEdge> edges = page.stream()
                .map(c -> new CategoryEdge(c, NamedCursor.from(c).serialize()))
                .toList();

        PageInfo pageInfo = new PageInfo(
                hasNextPage,
                edges.isEmpty() ? null : edges.getLast().cursor());

        return new CategoryConnection(new CategoryFilter(kind), edges, pageInfo);
    }

    @MutationMapping
    public Category createCategory(@Argument CreateCategoryInput input) {
        return categoryService.create(AuthUtil.currentUserId(), input.id(), input.kind(), input.icon(), input.name());
    }

    @MutationMapping
    public Category updateCategory(@Argument UpdateCategoryInput input) {
        return categoryService.update(AuthUtil.currentUserId(), input.id(), input.icon(), input.name());
    }

    @MutationMapping
    public boolean deleteCategory(@Argument UUID id, @Argument UUID mergeIntoId) {
        return categoryService.delete(AuthUtil.currentUserId(), id, mergeIntoId);
    }
}
