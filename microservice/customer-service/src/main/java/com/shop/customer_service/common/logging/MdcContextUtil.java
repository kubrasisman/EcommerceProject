package com.shop.customer_service.common.logging;

import org.slf4j.MDC;

/**
 * Utility class for managing business context in MDC (Mapped Diagnostic Context).
 * Allows adding business identifiers to logs for better traceability.
 */
public final class MdcContextUtil {

    // MDC Keys
    public static final String CUSTOMER_ID = "customerId";
    public static final String ADDRESS_ID = "addressId";

    private MdcContextUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Sets customer context in MDC.
     */
    public static void setCustomerContext(String customerId) {
        if (customerId != null) {
            MDC.put(CUSTOMER_ID, customerId);
        }
    }

    /**
     * Sets customer context in MDC with Long ID.
     */
    public static void setCustomerContext(Long customerId) {
        if (customerId != null) {
            MDC.put(CUSTOMER_ID, String.valueOf(customerId));
        }
    }

    /**
     * Sets address context in MDC.
     */
    public static void setAddressContext(Long addressId) {
        if (addressId != null) {
            MDC.put(ADDRESS_ID, String.valueOf(addressId));
        }
    }

    /**
     * Clears all business context from MDC.
     * Should be called in finally blocks to prevent context leakage.
     */
    public static void clearBusinessContext() {
        MDC.remove(CUSTOMER_ID);
        MDC.remove(ADDRESS_ID);
    }

    /**
     * Clears specific MDC key.
     */
    public static void clear(String key) {
        MDC.remove(key);
    }
}