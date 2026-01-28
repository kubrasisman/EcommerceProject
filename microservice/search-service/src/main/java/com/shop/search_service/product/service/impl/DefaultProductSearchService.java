package com.shop.search_service.product.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkOperation;
import com.shop.search_service.product.client.CategoryServiceClient;
import com.shop.search_service.product.client.ProductServiceClient;
import com.shop.search_service.product.client.response.ProductPageableResponse;
import com.shop.search_service.product.dto.response.ProductSearchResponse;
import com.shop.search_service.product.model.ProductDocument;
import com.shop.search_service.product.service.ProductIndexService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultProductSearchService implements ProductIndexService {
    private final ElasticsearchClient elasticsearchClient;
    private final ProductServiceClient productServiceClient;
    private final CategoryServiceClient categoryServiceClient;

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
    public ProductSearchResponse search(String keyword, Long categoryCode, int page, int size) {
        try {
            log.info("SEARCH: Searching products - keyword: {}, categoryCode: {}, page: {}, size: {}",
                    keyword, categoryCode, page, size);

            BoolQuery.Builder boolQuery = new BoolQuery.Builder();
            boolean hasQuery = false;

            // Add keyword search if provided
            if (keyword != null && !keyword.isBlank()) {
                boolQuery.must(QueryBuilders.multiMatch()
                        .query(keyword)
                        .fields("name", "description", "brand", "title")
                        .fuzziness("AUTO")
                        .build()._toQuery()
                );
                hasQuery = true;
            }

            // Add category filter if provided (including all descendant categories)
            if (categoryCode != null) {
                try {
                    // Get all descendant category codes
                    List<Long> allCategoryCodes = categoryServiceClient.getDescendantCodes(categoryCode);
                    log.info("SEARCH: Category {} has {} total codes (including descendants): {}",
                            categoryCode, allCategoryCodes.size(), allCategoryCodes);

                    // Use terms query to match any of the category codes
                    boolQuery.filter(QueryBuilders.terms()
                            .field("categoryCodes")
                            .terms(t -> t.value(allCategoryCodes.stream()
                                    .map(code -> co.elastic.clients.elasticsearch._types.FieldValue.of(code))
                                    .collect(Collectors.toList())))
                            .build()._toQuery()
                    );
                } catch (Exception e) {
                    log.warn("SEARCH: Failed to get descendant codes, falling back to single category: {}", e.getMessage());
                    // Fallback to single category if feign call fails
                    boolQuery.filter(QueryBuilders.term()
                            .field("categoryCodes")
                            .value(categoryCode)
                            .build()._toQuery()
                    );
                }
                hasQuery = true;
            }

            // If no filters, match all products
            if (!hasQuery) {
                boolQuery.must(QueryBuilders.matchAll().build()._toQuery());
            }

            SearchRequest request = SearchRequest.of(s -> s
                    .index(INDEX_NAME)
                    .query(boolQuery.build()._toQuery())
                    .from(page * size)
                    .size(size)
            );

            SearchResponse<ProductDocument> response =
                    elasticsearchClient.search(request, ProductDocument.class);

            List<ProductDocument> products = response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .collect(Collectors.toList());

            long totalHits = response.hits().total() != null ?
                    response.hits().total().value() : 0;
            int totalPages = (int) Math.ceil((double) totalHits / size);

            log.info("SEARCH: Found {} products, totalHits: {}, totalPages: {}",
                    products.size(), totalHits, totalPages);

            return ProductSearchResponse.builder()
                    .products(products)
                    .currentPage(page)
                    .totalPage(totalPages)
                    .totalElements(totalHits)
                    .build();

        } catch (Exception e) {
            log.error("SEARCH: Search error: {}", e.getMessage(), e);
            return ProductSearchResponse.builder()
                    .products(Collections.emptyList())
                    .currentPage(page)
                    .totalPage(0)
                    .totalElements(0L)
                    .build();
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
                        .code(Long.valueOf(product.getCode()))
                        .title(product.getTitle())
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
