package com.shop.order_service.common.logging;

import org.slf4j.MDC;

/**
 * Utility class for managing business context in MDC (Mapped Diagnostic Context).
 * Allows adding business identifiers to logs for better traceability.
 */
public final class MdcContextUtil {

    // MDC Keys
    public static final String ORDER_CODE = "orderCode";
    public static final String CART_CODE = "cartCode";
    public static final String PRODUCT_CODE = "productCode";
    public static final String PAYMENT_ID = "paymentId";

    private MdcContextUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Sets order context in MDC.
     */
    public static void setOrderContext(String orderCode) {
        if (orderCode != null) {
            MDC.put(ORDER_CODE, orderCode);
        }
    }

    /**
     * Sets cart context in MDC.
     */
    public static void setCartContext(String cartCode) {
        if (cartCode != null) {
            MDC.put(CART_CODE, cartCode);
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
     * Sets payment context in MDC.
     */
    public static void setPaymentContext(Long paymentId) {
        if (paymentId != null) {
            MDC.put(PAYMENT_ID, String.valueOf(paymentId));
        }
    }

    /**
     * Sets payment context in MDC with String ID.
     */
    public static void setPaymentContext(String paymentId) {
        if (paymentId != null) {
            MDC.put(PAYMENT_ID, paymentId);
        }
    }

    /**
     * Clears all business context from MDC.
     * Should be called in finally blocks to prevent context leakage.
     */
    public static void clearBusinessContext() {
        MDC.remove(ORDER_CODE);
        MDC.remove(CART_CODE);
        MDC.remove(PRODUCT_CODE);
        MDC.remove(PAYMENT_ID);
    }

    /**
     * Clears specific MDC key.
     */
    public static void clear(String key) {
        MDC.remove(key);
    }
}