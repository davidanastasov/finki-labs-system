package mk.ukim.finki.labs.backend.service.domain.impl;

import mk.ukim.finki.labs.backend.service.domain.HtmlSanitizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HtmlSanitizationServiceImplTest {
    
    private HtmlSanitizationService htmlSanitizationService;
    
    @BeforeEach
    void setUp() {
        htmlSanitizationService = new HtmlSanitizationServiceImpl();
    }
    
    @Test
    void testSanitizeHtml_removesDangerousScripts() {
        String maliciousHtml = "<p>Hello <script>alert('XSS')</script>World</p>";
        String sanitized = htmlSanitizationService.sanitizeHtml(maliciousHtml);
        
        assertFalse(sanitized.contains("<script>"));
        assertFalse(sanitized.contains("alert"));
        assertTrue(sanitized.contains("Hello"));
        assertTrue(sanitized.contains("World"));
    }
    
    @Test
    void testSanitizeHtml_preservesSafeFormatting() {
        String safeHtml = "<p>This is <strong>bold</strong> and <em>italic</em> text.</p>";
        String sanitized = htmlSanitizationService.sanitizeHtml(safeHtml);
        
        assertTrue(sanitized.contains("<p>"));
        assertTrue(sanitized.contains("<strong>"));
        assertTrue(sanitized.contains("<em>"));
        assertEquals(safeHtml, sanitized);
    }
    
    @Test
    void testSanitizeHtml_removesJavaScriptUrls() {
        String maliciousHtml = "<a href=\"javascript:alert('XSS')\">Click me</a>";
        String sanitized = htmlSanitizationService.sanitizeHtml(maliciousHtml);
        
        assertFalse(sanitized.contains("javascript:"));
        assertTrue(sanitized.contains("Click me"));
    }
    
    @Test
    void testGetTextLength_excludesHtmlTags() {
        String html = "<p>This is <strong>bold</strong> text with <a href=\"#\">a link</a>.</p>";
        int textLength = htmlSanitizationService.getTextLength(html);
        
        // Should count: "This is bold text with a link."
        assertEquals("This is bold text with a link.".length(), textLength);
    }
    
    @Test
    void testIsValidHtml_checksBothValidityAndLength() {
        String validShortHtml = "<p>Short text</p>";
        String validLongHtml = "<p>" + "A".repeat(2000) + "</p>";
        String invalidHtml = "<p>Unclosed paragraph";
        
        assertTrue(htmlSanitizationService.isValidHtml(validShortHtml, 1000));
        assertFalse(htmlSanitizationService.isValidHtml(validLongHtml, 1000));
        assertTrue(htmlSanitizationService.isValidHtml(invalidHtml, 1000)); // Jsoup is forgiving
    }
    
    @Test
    void testSanitizeHtml_handlesNullAndEmpty() {
        assertNull(htmlSanitizationService.sanitizeHtml(null));
        assertNull(htmlSanitizationService.sanitizeHtml(""));
        assertNull(htmlSanitizationService.sanitizeHtml("   "));
    }
}
