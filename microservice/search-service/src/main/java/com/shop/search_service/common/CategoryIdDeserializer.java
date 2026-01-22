package com.shop.search_service.common;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class CategoryIdDeserializer extends JsonDeserializer<Set<Long>> {
    @Override
    public Set<Long> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {

        Set<Long> ids = new HashSet<>();
        JsonNode node = p.getCodec().readTree(p);

        for (JsonNode category : node) {
            ids.add(category.get("code").asLong());
        }
        return ids;
    }
}
