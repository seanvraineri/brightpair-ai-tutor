import {
    hasSQLInjectionRisk,
    hasXSSRisk,
    InputSanitizer,
    isValidUUID,
    sanitizeEmail,
    sanitizeFileName,
    sanitizeFormData,
    sanitizeHTML,
    sanitizeJSON,
    sanitizeNumber,
    sanitizeSearchQuery,
    sanitizeText,
    sanitizeUrlParam,
} from "../sanitizer";

describe("InputSanitizer", () => {
    describe("sanitizeHTML", () => {
        it("should remove dangerous HTML tags", () => {
            const input = '<script>alert("XSS")</script><p>Safe content</p>';
            const result = sanitizeHTML(input);
            expect(result).toBe("<p>Safe content</p>");
            expect(result).not.toContain("<script>");
        });

        it("should allow safe HTML tags", () => {
            const input =
                "<p>Paragraph with <strong>bold</strong> and <em>italic</em></p>";
            const result = sanitizeHTML(input);
            expect(result).toBe(
                "<p>Paragraph with <strong>bold</strong> and <em>italic</em></p>",
            );
        });

        it("should handle empty input", () => {
            expect(sanitizeHTML("")).toBe("");
            expect(sanitizeHTML(null as any)).toBe("");
            expect(sanitizeHTML(undefined as any)).toBe("");
        });

        it("should remove event handlers", () => {
            const input = "<div onclick=\"alert('XSS')\">Click me</div>";
            const result = sanitizeHTML(input);
            expect(result).not.toContain("onclick");
        });
    });

    describe("sanitizeText", () => {
        it("should escape HTML special characters", () => {
            const input = '<script>alert("XSS")</script>';
            const result = sanitizeText(input);
            expect(result).toBe("alert(&quot;XSS&quot;)");
            expect(result).not.toContain("<");
            expect(result).not.toContain(">");
        });

        it("should handle normal text", () => {
            const input = "This is normal text";
            const result = sanitizeText(input);
            expect(result).toBe("This is normal text");
        });

        it("should trim whitespace", () => {
            const input = "  trimmed text  ";
            const result = sanitizeText(input);
            expect(result).toBe("trimmed text");
        });
    });

    describe("sanitizeEmail", () => {
        it("should validate and sanitize valid emails", () => {
            expect(sanitizeEmail("USER@EXAMPLE.COM")).toBe("user@example.com");
            expect(sanitizeEmail(" test@test.com ")).toBe("test@test.com");
        });

        it("should reject invalid emails", () => {
            expect(sanitizeEmail("not-an-email")).toBeNull();
            expect(sanitizeEmail("@example.com")).toBeNull();
            expect(sanitizeEmail("user@")).toBeNull();
            expect(sanitizeEmail("")).toBeNull();
        });
    });

    describe("sanitizeNumber", () => {
        it("should convert valid numbers", () => {
            expect(sanitizeNumber("123")).toBe(123);
            expect(sanitizeNumber(456)).toBe(456);
            expect(sanitizeNumber("78.9")).toBe(78.9);
        });

        it("should handle min/max constraints", () => {
            expect(sanitizeNumber(5, 10, 100)).toBe(10);
            expect(sanitizeNumber(150, 10, 100)).toBe(100);
            expect(sanitizeNumber(50, 10, 100)).toBe(50);
        });

        it("should return null for invalid input", () => {
            expect(sanitizeNumber("not a number")).toBeNull();
            expect(sanitizeNumber(NaN)).toBeNull();
        });
    });

    describe("sanitizeUrlParam", () => {
        it("should URL encode parameters", () => {
            expect(sanitizeUrlParam("hello world")).toBe("hello%20world");
            expect(sanitizeUrlParam("test@example.com")).toBe(
                "test%40example.com",
            );
            expect(sanitizeUrlParam("a&b=c")).toBe("a%26b%3Dc");
        });

        it("should handle empty input", () => {
            expect(sanitizeUrlParam("")).toBe("");
            expect(sanitizeUrlParam(null as any)).toBe("");
        });
    });

    describe("hasSQLInjectionRisk", () => {
        it("should detect SQL injection patterns", () => {
            expect(hasSQLInjectionRisk("'; DROP TABLE users; --")).toBe(true);
            expect(hasSQLInjectionRisk("SELECT * FROM users")).toBe(true);
            expect(hasSQLInjectionRisk("1 OR 1=1")).toBe(true);
            expect(hasSQLInjectionRisk("UNION SELECT password")).toBe(true);
        });

        it("should not flag safe input", () => {
            expect(hasSQLInjectionRisk("normal search query")).toBe(false);
            expect(hasSQLInjectionRisk("user@example.com")).toBe(false);
        });
    });

    describe("hasXSSRisk", () => {
        it("should detect XSS patterns", () => {
            expect(hasXSSRisk('<script>alert("XSS")</script>')).toBe(true);
            expect(hasXSSRisk("javascript:alert(1)")).toBe(true);
            expect(hasXSSRisk("<img onerror=alert(1)>")).toBe(true);
        });

        it("should not flag safe input", () => {
            expect(hasXSSRisk("normal text")).toBe(false);
            expect(hasXSSRisk("math equation: 2 < 3")).toBe(false);
        });
    });

    describe("sanitizeFileName", () => {
        it("should remove dangerous characters from filenames", () => {
            expect(sanitizeFileName("../../../etc/passwd")).toBe("etcpasswd");
            expect(sanitizeFileName("file\\name.txt")).toBe("filename.txt");
            expect(sanitizeFileName("file name.txt")).toBe("filename.txt");
        });

        it("should handle hidden files", () => {
            expect(sanitizeFileName(".hidden")).toBe("hidden");
            expect(sanitizeFileName(".htaccess")).toBe("htaccess");
        });

        it("should preserve valid characters", () => {
            expect(sanitizeFileName("valid-file_name.txt")).toBe(
                "valid-file_name.txt",
            );
            expect(sanitizeFileName("file123.pdf")).toBe("file123.pdf");
        });

        it("should handle empty input", () => {
            expect(sanitizeFileName("")).toBe("unnamed");
            expect(sanitizeFileName("...")).toBe("unnamed");
        });
    });

    describe("sanitizeJSON", () => {
        it("should parse and sanitize valid JSON", () => {
            const input = '{"name": "<script>alert()</script>", "age": 25}';
            const result = sanitizeJSON(input);
            expect(result).toEqual({
                name: "alert()",
                age: 25,
            });
        });

        it("should handle nested objects", () => {
            const input =
                '{"user": {"name": "<b>Test</b>", "tags": ["<script>", "normal"]}}';
            const result = sanitizeJSON(input);
            expect(result).toEqual({
                user: {
                    name: "Test",
                    tags: ["", "normal"],
                },
            });
        });

        it("should return null for invalid JSON", () => {
            expect(sanitizeJSON("not json")).toBeNull();
            expect(sanitizeJSON("")).toBeNull();
        });
    });

    describe("sanitizeFormData", () => {
        it("should sanitize all string values in form data", () => {
            const input = {
                name: "<script>alert()</script>",
                email: "test@example.com",
                age: 25,
                bio: "Normal text",
            };

            const result = sanitizeFormData(input);
            expect(result).toEqual({
                name: "alert()",
                email: "test@example.com",
                age: 25,
                bio: "Normal text",
            });
        });

        it("should handle nested objects", () => {
            const input = {
                user: {
                    name: "<b>Test</b>",
                    settings: {
                        theme: "dark",
                        notifications: true,
                    },
                },
            };

            const result = sanitizeFormData(input);
            expect(result.user.name).toBe("Test");
            expect(result.user.settings.theme).toBe("dark");
        });
    });

    describe("isValidUUID", () => {
        it("should validate correct UUIDs", () => {
            expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(
                true,
            );
            expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(
                true,
            );
        });

        it("should reject invalid UUIDs", () => {
            expect(isValidUUID("not-a-uuid")).toBe(false);
            expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
            expect(isValidUUID("")).toBe(false);
        });
    });

    describe("sanitizeSearchQuery", () => {
        it("should remove dangerous characters from search queries", () => {
            expect(sanitizeSearchQuery("<script>test</script>")).toBe("test");
            expect(sanitizeSearchQuery("normal search query")).toBe(
                "normal search query",
            );
            expect(sanitizeSearchQuery("test; DROP TABLE;")).toBe(
                "test DROP TABLE",
            );
        });

        it("should limit query length", () => {
            const longQuery = "a".repeat(150);
            const result = sanitizeSearchQuery(longQuery);
            expect(result.length).toBe(100);
        });

        it("should handle custom max length", () => {
            const query = "test query";
            const result = sanitizeSearchQuery(query, 5);
            expect(result).toBe("test");
        });
    });
});
