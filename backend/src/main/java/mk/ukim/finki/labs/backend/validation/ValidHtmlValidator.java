package mk.ukim.finki.labs.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import mk.ukim.finki.labs.backend.service.domain.HtmlSanitizationService;
import org.springframework.beans.factory.annotation.Autowired;

public class ValidHtmlValidator implements ConstraintValidator<ValidHtml, String> {
    
    @Autowired
    private HtmlSanitizationService htmlSanitizationService;
    
    private int maxTextLength;
    private boolean required;
    
    @Override
    public void initialize(ValidHtml constraintAnnotation) {
        this.maxTextLength = constraintAnnotation.maxTextLength();
        this.required = constraintAnnotation.required();
    }
    
    @Override
    public boolean isValid(String html, ConstraintValidatorContext context) {
        // Handle null/empty cases
        if (html == null || html.trim().isEmpty()) {
            return !required; // Valid if not required, invalid if required
        }
        
        // Check if HTML is valid and within text length limits
        if (!htmlSanitizationService.isValidHtml(html, maxTextLength)) {
            // Get the actual text length for a more specific error message
            int actualTextLength = htmlSanitizationService.getTextLength(html);
            if (actualTextLength > maxTextLength) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    String.format("Description text content must not exceed %d characters (current: %d)", 
                                maxTextLength, actualTextLength)
                ).addConstraintViolation();
            } else {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Invalid HTML content")
                       .addConstraintViolation();
            }
            return false;
        }
        
        return true;
    }
}
