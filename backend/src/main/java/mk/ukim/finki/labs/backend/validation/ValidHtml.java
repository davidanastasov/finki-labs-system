package mk.ukim.finki.labs.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Validation annotation for HTML content that checks both the text length
 * (excluding HTML tags) and ensures the HTML is safe.
 */
@Documented
@Constraint(validatedBy = ValidHtmlValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidHtml {
    
    String message() default "Invalid HTML content";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Maximum allowed text length (excluding HTML tags)
     */
    int maxTextLength() default 1000;
    
    /**
     * Whether the field is required (non-null and non-empty)
     */
    boolean required() default false;
}
