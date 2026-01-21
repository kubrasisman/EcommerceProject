package com.core.media_service.common.logging;

import org.slf4j.MDC;

/**
 * Utility class for managing business context in MDC (Mapped Diagnostic Context).
 * Allows adding business identifiers to logs for better traceability.
 */
public final class MdcContextUtil {

    // MDC Keys
    public static final String MEDIA_CODE = "mediaCode";
    public static final String MEDIA_TYPE = "mediaType";

    private MdcContextUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Sets media context in MDC.
     */
    public static void setMediaContext(String mediaCode) {
        if (mediaCode != null) {
            MDC.put(MEDIA_CODE, mediaCode);
        }
    }

    /**
     * Sets media type context in MDC.
     */
    public static void setMediaTypeContext(String mediaType) {
        if (mediaType != null) {
            MDC.put(MEDIA_TYPE, mediaType);
        }
    }

    /**
     * Clears all business context from MDC.
     * Should be called in finally blocks to prevent context leakage.
     */
    public static void clearBusinessContext() {
        MDC.remove(MEDIA_CODE);
        MDC.remove(MEDIA_TYPE);
    }

    /**
     * Clears specific MDC key.
     */
    public static void clear(String key) {
        MDC.remove(key);
    }
}
