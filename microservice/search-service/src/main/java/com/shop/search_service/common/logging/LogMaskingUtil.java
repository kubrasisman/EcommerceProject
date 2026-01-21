package com.shop.search_service.common.logging;

/**
 * Utility class for masking sensitive data in logs.
 * Used to prevent exposure of PII (Personally Identifiable Information).
 */
public final class LogMaskingUtil {

    private LogMaskingUtil() {
        // Utility class, prevent instantiation
    }

    /**
     * Masks email address for logging.
     * Example: "john.doe@example.com" -> "joh***@example.com"
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        int atIndex = email.indexOf("@");
        int visibleChars = Math.min(3, atIndex);
        return email.substring(0, visibleChars) + "***" + email.substring(atIndex);
    }

    /**
     * Masks JWT token for logging.
     * Example: "eyJhbGciOiJIUzI1NiIsInR5..." -> "eyJhbG...InR5"
     */
    public static String maskToken(String token) {
        if (token == null || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }

    /**
     * Masks any string by keeping first and last few characters.
     * Example: "secretvalue" -> "sec***lue"
     */
    public static String maskGeneric(String value, int visibleStart, int visibleEnd) {
        if (value == null || value.length() <= visibleStart + visibleEnd) {
            return "***";
        }
        return value.substring(0, visibleStart) + "***" + value.substring(value.length() - visibleEnd);
    }
}
