package com.shop.order_service.common.utils;

import java.util.concurrent.atomic.AtomicInteger;

public class CodeGenerator {
    private static final AtomicInteger COUNTER = new AtomicInteger(100000);

    public static String generateCode() {
        return String.valueOf(COUNTER.getAndIncrement());
    }
}
