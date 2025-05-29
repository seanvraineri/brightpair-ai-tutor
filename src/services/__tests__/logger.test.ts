import { Logger, LogLevel } from "../logger";

describe("Logger", () => {
    let logger: Logger;
    let mockConsoleDebug: jest.SpyInstance;
    let mockConsoleInfo: jest.SpyInstance;
    let mockConsoleWarn: jest.SpyInstance;
    let mockConsoleError: jest.SpyInstance;

    // Mock localStorage
    const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn(),
        length: 0,
        key: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock sessionStorage
    const sessionStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn(),
        length: 0,
        key: jest.fn(),
    };
    Object.defineProperty(window, "sessionStorage", {
        value: sessionStorageMock,
    });

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create console spies
        mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation(
            () => {},
        );
        mockConsoleInfo = jest.spyOn(console, "info").mockImplementation(
            () => {},
        );
        mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation(
            () => {},
        );
        mockConsoleError = jest.spyOn(console, "error").mockImplementation(
            () => {},
        );

        // Create new logger instance for each test
        logger = new Logger();
    });

    afterEach(() => {
        // Restore all mocks
        mockConsoleDebug.mockRestore();
        mockConsoleInfo.mockRestore();
        mockConsoleWarn.mockRestore();
        mockConsoleError.mockRestore();
    });

    describe("logging methods", () => {
        it("should log debug messages in development", () => {
            logger.debug("Debug message", { extra: "data" });

            expect(mockConsoleDebug).toHaveBeenCalledWith(
                expect.stringContaining("DEBUG: Debug message"),
                { extra: "data" },
            );
        });

        it("should log info messages", () => {
            logger.info("Info message");

            expect(mockConsoleInfo).toHaveBeenCalledWith(
                expect.stringContaining("INFO: Info message"),
                undefined,
            );
        });

        it("should log warning messages", () => {
            logger.warn("Warning message");

            expect(mockConsoleWarn).toHaveBeenCalledWith(
                expect.stringContaining("WARN: Warning message"),
                undefined,
            );
        });

        it("should log error messages", () => {
            const error = new Error("Test error");
            logger.error("Error message", error, { context: "test" });

            expect(mockConsoleError).toHaveBeenCalledWith(
                expect.stringContaining("ERROR: Error message"),
                error,
                { context: "test" },
            );
        });
    });

    describe("log levels", () => {
        it("should respect log level settings", () => {
            logger.setLogLevel(LogLevel.ERROR);

            logger.debug("Debug message");
            logger.info("Info message");
            logger.warn("Warning message");
            logger.error("Error message");

            expect(mockConsoleDebug).not.toHaveBeenCalled();
            expect(mockConsoleInfo).not.toHaveBeenCalled();
            expect(mockConsoleWarn).not.toHaveBeenCalled();
            expect(mockConsoleError).toHaveBeenCalled();
        });
    });

    describe("log buffer", () => {
        it("should maintain a buffer of recent logs", () => {
            logger.debug("Message 1");
            logger.info("Message 2");
            logger.warn("Message 3");

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs).toHaveLength(3);
            expect(recentLogs[0].message).toBe("Message 1");
            expect(recentLogs[1].message).toBe("Message 2");
            expect(recentLogs[2].message).toBe("Message 3");
        });

        it("should limit buffer size to maxBufferSize", () => {
            // Fill buffer beyond max size (100)
            for (let i = 0; i < 150; i++) {
                logger.debug(`Message ${i}`);
            }

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs).toHaveLength(100);
            expect(recentLogs[0].message).toBe("Message 50"); // First 50 were removed
        });

        it("should clear logs when requested", () => {
            logger.debug("Message 1");
            logger.info("Message 2");

            logger.clearLogs();

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs).toHaveLength(0);
        });
    });

    describe("session management", () => {
        it("should create and store session ID", () => {
            sessionStorageMock.getItem.mockReturnValue(null);

            // Logger should create a session ID internally
            logger.debug("Test message");

            expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
                "sessionId",
                expect.any(String),
            );
        });

        it("should reuse existing session ID", () => {
            const existingSessionId = "existing-session-123";
            sessionStorageMock.getItem.mockReturnValue(existingSessionId);

            logger.debug("Test message");

            expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
        });
    });

    describe("user ID extraction", () => {
        it("should extract user ID from localStorage", () => {
            const mockUserData = {
                user: { id: "user-123" },
            };
            localStorageMock.getItem.mockReturnValue(
                JSON.stringify(mockUserData),
            );

            logger.debug("Test message");

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs[0].userId).toBe("user-123");
        });

        it("should handle missing user data", () => {
            localStorageMock.getItem.mockReturnValue(null);

            logger.debug("Test message");

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs[0].userId).toBeUndefined();
        });

        it("should handle invalid JSON in localStorage", () => {
            localStorageMock.getItem.mockReturnValue("invalid-json");

            logger.debug("Test message");

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs[0].userId).toBeUndefined();
        });
    });

    describe("error handling", () => {
        it("should convert non-Error objects to Error instances", () => {
            logger.error("Error message", "string error");

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs[0].error).toBeInstanceOf(Error);
            expect(recentLogs[0].error?.message).toBe("string error");
        });

        it("should handle null/undefined errors", () => {
            logger.error("Error message", null);

            const recentLogs = logger.getRecentLogs();
            expect(recentLogs[0].error).toBeInstanceOf(Error);
            expect(recentLogs[0].error?.message).toBe("null");
        });
    });
});
