package com.nickmessing.finance_tracker.resolver.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

public record NamedCursor(String name, UUID id) {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public interface NamedEntity {
        String getName();
        UUID getId();
    }

    public static NamedCursor from(NamedEntity entity) {
        return new NamedCursor(entity.getName(), entity.getId());
    }

    public static NamedCursor deserialize(String cursor) {
        try {
            String json = new String(Base64.getDecoder().decode(cursor));
            List<String> parts = MAPPER.readValue(
                    json,
                    MAPPER.getTypeFactory().constructCollectionType(List.class, String.class));
            return new NamedCursor(parts.get(0), UUID.fromString(parts.get(1)));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid cursor", e);
        }
    }

    public String serialize() {
        try {
            String json = MAPPER.writeValueAsString(List.of(name, id.toString()));
            return Base64.getEncoder().encodeToString(json.getBytes());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to encode cursor", e);
        }
    }
}
