package mk.ukim.finki.labs.backend.service.domain.impl;

import mk.ukim.finki.labs.backend.service.domain.HtmlSanitizationService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

@Service
public class HtmlSanitizationServiceImpl implements HtmlSanitizationService {
    
    // Define allowed HTML tags and attributes for rich text content
    private static final Safelist RICH_TEXT_SAFELIST = Safelist.relaxed()
            // Basic formatting
            .addTags("p", "br", "div", "span")
            // Headings
            .addTags("h1", "h2", "h3", "h4", "h5", "h6")
            // Text formatting
            .addTags("strong", "b", "em", "i", "u", "s", "del", "ins", "mark", "small", "sub", "sup")
            // Lists
            .addTags("ul", "ol", "li")
            // Links (with restricted attributes for security)
            .addTags("a")
            .addAttributes("a", "href", "title")
            .addProtocols("a", "href", "http", "https", "mailto")
            // Tables
            .addTags("table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption")
            .addAttributes("table", "class")
            .addAttributes("th", "scope", "class")
            .addAttributes("td", "class")
            // Quotes and code
            .addTags("blockquote", "q", "cite", "code", "pre", "kbd", "samp", "var")
            // Images (with security restrictions)
            .removeTags("img")
//            .addTags("img")
//            .addAttributes("img", "src", "alt", "title", "width", "height")
//            .addProtocols("img", "src", "http", "https", "data")
            // Horizontal rules
            .addTags("hr")
            // Common attributes for styling (limited set)
            .addAttributes(":all", "class", "id", "style", "title")
            // Remove any dangerous attributes
            .removeAttributes(":all", "onclick", "onload", "onerror", "onmouseover", "onfocus", "onblur");
    
    @Override
    public String sanitizeHtml(String html) {
        if (html == null || html.trim().isEmpty()) {
            return null;
        }
        
        // Clean the HTML with our safelist
        String cleanHtml = Jsoup.clean(html, RICH_TEXT_SAFELIST);
        
        // Additional sanitization: remove any remaining script-like content
        cleanHtml = cleanHtml.replaceAll("(?i)javascript:", "")
                            .replaceAll("(?i)vbscript:", "")
                            .replaceAll("(?i)data:text/html", "data:text/plain");
        
        return cleanHtml.trim();
    }
    
    @Override
    public int getTextLength(String html) {
        if (html == null || html.trim().isEmpty()) {
            return 0;
        }
        
        // Parse the HTML and extract only the text content
        Document doc = Jsoup.parse(html);
        String textContent = doc.text();
        
        return textContent.length();
    }
    
    @Override
    public boolean isValidHtml(String html, int maxTextLength) {
        if (html == null) {
            return true; // null is considered valid (optional field)
        }
        
        // Check if text length exceeds the limit
        int textLength = getTextLength(html);
        if (textLength > maxTextLength) {
            return false;
        }
        
        try {
            // Try to parse the HTML - if it fails, it's invalid
            Jsoup.parse(html);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
