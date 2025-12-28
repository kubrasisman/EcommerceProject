package com.shop.search_service.product.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkOperation;
import com.shop.search_service.product.client.ProductServiceClient;
import com.shop.search_service.product.client.response.ProductPageableResponse;
import com.shop.search_service.product.model.ProductDocument;
import com.shop.search_service.product.service.ProductIndexService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultProductSearchService implements ProductIndexService {
    private final ElasticsearchClient elasticsearchClient;
    private final ProductServiceClient productServiceClient;

    private final String INDEX_NAME = "products";

    @Override
    public String indexProduct(ProductDocument product) {
        try {
            elasticsearchClient.index(i -> i
                    .index(INDEX_NAME)
                    .id(product.getId())
                    .document(product)
            );
            return "Product indexed successfully: " + product.getId();
        } catch (Exception e) {
            throw new RuntimeException("Elasticsearch index error: " + e.getMessage(), e);
        }
    }

    @Override
    public String indexAll() {
        try {
            List<ProductDocument> products = getAllProducts();
            List<BulkOperation> operations = products.stream()
                    .map(product ->
                            BulkOperation.of(op ->
                                    op.index(idx -> idx
                                            .index(INDEX_NAME)
                                            .id(product.getId())
                                            .document(product)
                                    )
                            )
                    ).toList();

            BulkRequest bulkRequest = BulkRequest.of(br -> br.operations(operations));
            BulkResponse response = elasticsearchClient.bulk(bulkRequest);
            if (response.errors()) {
                return "All products index completed with errors";
            }
            return "All products index completed successfully. Total: " + products.size();
        } catch (Exception e) {
            throw new RuntimeException("All products indexing error: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ProductDocument> search(String keyword, int page, int size) {
        try {
            SearchRequest request = SearchRequest.of(s -> s
                    .index(INDEX_NAME)
                    .query(QueryBuilders.multiMatch()
                            .query(keyword)
                            .fields("name", "description", "brand")
                            .fuzziness("AUTO")
                            .build()._toQuery()
                    )
                    .from(page * size)
                    .size(size)
            );

            SearchResponse<ProductDocument> response =
                    elasticsearchClient.search(request, ProductDocument.class);

            return response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Search error: " + e.getMessage(), e);
            return null;
        }
    }
    private List<ProductDocument> getAllProducts() {
        List<ProductDocument> documentList = new ArrayList<>();
        int page = 0;
        int size = 50;
        ProductPageableResponse response;
        do {
            response = productServiceClient.getProducts(page, size, "ASC", "id");
            response.getProducts().forEach(product -> {
                ProductDocument productDocument = ProductDocument.builder()
                        .id(String.valueOf(product.getCode()))
                        .name(product.getName())
                        .description(product.getDescription())
                        .imageUrl(product.getImageUrl())
                        .brand(product.getBrand())
                        .price(product.getPrice())
                        .categoryCodes(product.getCategoryCodes())
                        .build();
                documentList.add(productDocument);
            });
            page++;
        } while (page < response.getTotalPage());
        return documentList;
    }

}
