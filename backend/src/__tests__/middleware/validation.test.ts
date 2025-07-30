import { sanitizeInput } from "../../middleware/validation";

describe("Validation Middleware", () => {
  describe("sanitizeInput", () => {
    it("should handle null input", () => {
      expect(() => sanitizeInput(null as any)).toThrow();
    });

    it("should handle undefined input", () => {
      expect(() => sanitizeInput(undefined as any)).toThrow();
    });

    it("should handle non-string input", () => {
      expect(() => sanitizeInput(123 as any)).toThrow();
    });

    it("should trim whitespace from string input", () => {
      const result = sanitizeInput("  hello world  ");
      expect(result).toBe("hello world");
    });

    it("should remove angle brackets from input", () => {
      const result = sanitizeInput('<script>alert("xss")</script>hello world');
      expect(result).toBe('scriptalert("xss")/scripthello world');
    });

    it("should remove multiple angle brackets", () => {
      const result = sanitizeInput("<div><p>Hello</p><span>World</span></div>");
      expect(result).toBe("divpHello/pspanWorld/span/div");
    });

    it("should handle empty string", () => {
      const result = sanitizeInput("");
      expect(result).toBe("");
    });

    it("should handle string with only whitespace", () => {
      const result = sanitizeInput("   ");
      expect(result).toBe("");
    });

    it("should handle string with only angle brackets", () => {
      const result = sanitizeInput("<div></div><p></p>");
      expect(result).toBe("div/divp/p");
    });

    it("should preserve valid text content", () => {
      const result = sanitizeInput(
        "This is valid text with numbers 123 and symbols !@#"
      );
      expect(result).toBe(
        "This is valid text with numbers 123 and symbols !@#"
      );
    });

    it("should handle mixed content with angle brackets and text", () => {
      const result = sanitizeInput(
        '<p>Hello</p> World <script>alert("test")</script>!'
      );
      expect(result).toBe('pHello/p World scriptalert("test")/script!');
    });

    it("should handle special characters", () => {
      const result = sanitizeInput("Special chars: áéíóú ñ ç ß");
      expect(result).toBe("Special chars: áéíóú ñ ç ß");
    });

    it("should handle URLs", () => {
      const result = sanitizeInput("https://example.com/path?param=value");
      expect(result).toBe("https://example.com/path?param=value");
    });

    it("should handle email addresses", () => {
      const result = sanitizeInput("user@example.com");
      expect(result).toBe("user@example.com");
    });

    it("should handle complex HTML with attributes", () => {
      const result = sanitizeInput('<div class="test" id="main">Content</div>');
      expect(result).toBe('div class="test" id="main"Content/div');
    });

    it("should handle nested HTML tags", () => {
      const result = sanitizeInput(
        "<div><p><strong>Bold</strong> text</p></div>"
      );
      expect(result).toBe("divpstrongBold/strong text/p/div");
    });

    it("should handle self-closing HTML tags", () => {
      const result = sanitizeInput("Text <br/> more text <hr/> end");
      expect(result).toBe("Text br/ more text hr/ end");
    });

    it("should handle malformed HTML", () => {
      const result = sanitizeInput("<div>Content<p>More content");
      expect(result).toBe("divContentpMore content");
    });

    it("should handle HTML entities", () => {
      const result = sanitizeInput("&lt;div&gt;Content&lt;/div&gt;");
      expect(result).toBe("&lt;div&gt;Content&lt;/div&gt;");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const result = sanitizeInput(longString);
      expect(result).toBe(longString);
    });

    it("should handle strings with newlines and tabs", () => {
      const result = sanitizeInput("Line 1\nLine 2\tTabbed content");
      expect(result).toBe("Line 1\nLine 2\tTabbed content");
    });
  });
});
