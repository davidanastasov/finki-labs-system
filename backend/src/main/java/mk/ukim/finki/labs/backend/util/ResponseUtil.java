package mk.ukim.finki.labs.backend.util;

import mk.ukim.finki.labs.backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {

    private ResponseUtil() {}

    // ----------------- Success responses -----------------

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(new ApiResponse<>(data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(data));
    }

    public static ResponseEntity<ApiResponse<Void>> noContent() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponse<>(null));
    }

    // ----------------- Error responses -----------------

    public static <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new ApiResponse<>(message, status.value()));
    }

    public static <T> ResponseEntity<ApiResponse<T>> badRequest(String message) {
        return error(message, HttpStatus.BAD_REQUEST);
    }

    public static <T> ResponseEntity<ApiResponse<T>> notFound(String message) {
        return error(message, HttpStatus.NOT_FOUND);
    }

    public static <T> ResponseEntity<ApiResponse<T>> internalError(String message) {
        return error(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
