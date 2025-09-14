package mk.ukim.finki.labs.backend.service.domain;

public interface HtmlSanitizationService {
    
    /**
     * Sanitizes HTML content to prevent XSS attacks while preserving safe formatting tags.
     * 
     * @param html the raw HTML content to sanitize
     * @return sanitized HTML content safe for rendering
     */
    String sanitizeHtml(String html);
    
    /**
     * Calculates the text length of HTML content (excluding HTML tags).
     * This is used for validation purposes to ensure the actual text content
     * doesn't exceed character limits.
     * 
     * @param html the HTML content
     * @return the length of the text content without HTML tags
     */
    int getTextLength(String html);
    
    /**
     * Validates if the HTML content is safe and within acceptable limits.
     * 
     * @param html the HTML content to validate
     * @param maxTextLength maximum allowed text length (excluding HTML tags)
     * @return true if the content is valid, false otherwise
     */
    boolean isValidHtml(String html, int maxTextLength);
}
