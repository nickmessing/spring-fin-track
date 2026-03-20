package com.nickmessing.finance_tracker.resolver.common;

import java.util.UUID;

public record IdCursor(UUID id) {

    public static IdCursor from(UUID id) {
        return new IdCursor(id);
    }

    public static IdCursor deserialize(String cursor) {
        return new IdCursor(UUID.fromString(cursor));
    }

    public String serialize() {
        return id.toString();
    }
}
