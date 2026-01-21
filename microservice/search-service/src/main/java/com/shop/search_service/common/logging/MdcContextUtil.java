package com.shop.search_service.common.logging;

import org.slf4j.MDC;

/**
 * Utility class for managing business context in MDC (Mapped Diagnostic Context).
 * Allows adding business identifiers to logs for better traceability.
 */
public final class MdcContextUtil {

    // MDC Keys
    public static final String SEARCH_KEYWORD = "searchKeyword";
    public static final String PRODUCT_CODE = "productCode";

    private MdcContextUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Sets search keyword context in MDC.
     */
    public static void setSearchContext(String keyword) {
        if (keyword != null) {
            MDC.put(SEARCH_KEYWORD, keyword);
        }
    }

    /**
     * Sets product context in MDC.
     */
    public static void setProductContext(String productCode) {
        if (productCode != null) {
            MDC.put(PRODUCT_CODE, productCode);
        }
    }

    /**
     * Clears all business context from MDC.
     * Should be called in finally blocks to prevent context leakage.
     */
    public static void clearBusinessContext() {
        MDC.remove(SEARCH_KEYWORD);
        MDC.remove(PRODUCT_CODE);
    }

    /**
     * Clears specific MDC key.
     */
    public static void clear(String key) {
        MDC.remove(key);
    }
}
