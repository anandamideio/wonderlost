/**
 * Lifecycle phases for Tome modules
 */
export declare enum TomePhase {
    /** Module instance created but not initialized */
    CREATED = "created",
    /** Dependencies resolved and hooks registered */
    INITIALIZED = "initialized",
    /** Module fully ready and operational */
    READY = "ready",
    /** Module has been destroyed */
    DESTROYED = "destroyed"
}
/**
 * Error boundary utility for wrapping critical operations
 */
export declare class TomeErrorBoundary {
    /**
     * Execute a function with error boundary protection
     * @param fn The function to execute
     * @param context Description of what's being executed
     * @param moduleName Name of the module for logging
     * @param onError Optional error handler
     * @returns The result of the function or null if it failed
     */
    static execute<T>(fn: () => T | Promise<T>, context: string, moduleName: string, onError?: (error: Error) => void): Promise<T | null>;
    /**
     * Execute a synchronous function with error boundary protection
     * @param fn The function to execute
     * @param context Description of what's being executed
     * @param moduleName Name of the module for logging
     * @param onError Optional error handler
     * @returns The result of the function or null if it failed
     */
    static executeSync<T>(fn: () => T, context: string, moduleName: string, onError?: (error: Error) => void): T | null;
    /**
     * Execute a function with retry logic
     * @param fn The function to execute
     * @param context Description of what's being executed
     * @param moduleName Name of the module for logging
     * @param maxAttempts Maximum number of attempts (default: 3)
     * @param delayMs Delay between attempts in milliseconds (default: 1000)
     * @returns The result of the function or null if all attempts failed
     */
    static executeWithRetry<T>(fn: () => T | Promise<T>, context: string, moduleName: string, maxAttempts?: number, delayMs?: number): Promise<T | null>;
}
//# sourceMappingURL=TomeLifecycle.d.ts.map