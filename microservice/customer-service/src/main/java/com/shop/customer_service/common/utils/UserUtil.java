package com.shop.customer_service.common.utils;

import org.springframework.web.context.request.RequestContextHolder;

import java.util.Objects;

public class UserUtil {
    public static String current(){
        Object user = Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).getAttribute("user", 0);
        return Objects.nonNull(user) ? String.valueOf(user) : null;
    }
}
