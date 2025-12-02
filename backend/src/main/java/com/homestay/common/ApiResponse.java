package com.homestay.common;

import lombok.Data;
import java.io.Serializable;

@Data
public class ApiResponse<T> implements Serializable {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(T data) {
        return success("操作成功", data);
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return error(400, message);
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        response.setData(null);
        return response;
    }
    
    public static <T> ApiResponse<T> unauthorized(String message) {
        return error(401, message);
    }
    
    public static <T> ApiResponse<T> forbidden(String message) {
        return error(403, message);
    }
    
    public static <T> ApiResponse<T> notFound(String message) {
        return error(404, message);
    }
    
    public static <T> ApiResponse<T> serverError(String message) {
        return error(500, message);
    }
}
