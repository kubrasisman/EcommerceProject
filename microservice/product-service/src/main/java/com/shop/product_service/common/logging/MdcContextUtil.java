package com.shop.product_service.common.logging;

import org.slf4j.MDC;

/**
 * Utility class for managing business context in MDC (Mapped Diagnostic Context).
 * Allows adding business identifiers to logs for better traceability.
 */
public final class MdcContextUtil {

    // MDC Keys
    public static final String PRODUCT_CODE = "productCode";
    public static final String CATEGORY_CODE = "categoryCode";

    private MdcContextUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Sets product context in MDC.
     */
    public static void setProductContext(Long productCode) {
        if (productCode != null) {
            MDC.put(PRODUCT_CODE, String.valueOf(productCode));
        }
    }

    /**
     * Sets product context in MDC with String code.
     */
    public static void setProductContext(String productCode) {
        if (productCode != null) {
            MDC.put(PRODUCT_CODE, productCode);
        }
    }

    /**
     * Sets category context in MDC.
     */
    public static void setCategoryContext(Long categoryCode) {
        if (categoryCode != null) {
            MDC.put(CATEGORY_CODE, String.valueOf(categoryCode));
        }
    }

    /**
     * Sets category context in MDC with String code.
     */
    public static void setCategoryContext(String categoryCode) {
        if (categoryCode != null) {
            MDC.put(CATEGORY_CODE, categoryCode);
        }
    }

    /**
     * Clears all business context from MDC.
     * Should be called in finally blocks to prevent context leakage.
     */
    public static void clearBusinessContext() {
        MDC.remove(PRODUCT_CODE);
        MDC.remove(CATEGORY_CODE);
    }

    /**
     * Clears specific MDC key.
     */
    public static void clear(String key) {
        MDC.remove(key);
    }
}
