package mk.ukim.finki.labs.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Generic API response, success or failure")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private Integer statusCode;

    // Success constructor
    public ApiResponse(T data) {
        this.success = true;
        this.data = data;
    }

    // Failure constructor
    public ApiResponse(String message, int statusCode) {
        this.success = false;
        this.message = message;
        this.statusCode = statusCode;
    }
}
