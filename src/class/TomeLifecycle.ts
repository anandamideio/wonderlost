/**
 * Lifecycle phases for Tome modules
 */
export enum TomePhase {
  /** Module instance created but not initialized */
  CREATED = 'created',
  /** Dependencies resolved and hooks registered */
  INITIALIZED = 'initialized',
  /** Module fully ready and operational */
  READY = 'ready',
  /** Module has been destroyed */
  DESTROYED = 'destroyed',
}

/**
 * Error boundary utility for wrapping critical operations
 */
export class TomeErrorBoundary {
  /**
   * Execute a function with error boundary protection
   * @param fn The function to execute
   * @param context Description of what's being executed
   * @param moduleName Name of the module for logging
   * @param onError Optional error handler
   * @returns The result of the function or null if it failed
   */
  static async execute<T>(
    fn: () => T | Promise<T>,
    context: string,
    moduleName: string,
    onError?: (error: Error) => void,
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';

      console.error(`${moduleName} | Error in ${context}:`, errorMessage);
      if (errorStack) {
        console.error(`${moduleName} | Stack trace:`, errorStack);
      }

      if (onError) {
        try {
          onError(error instanceof Error ? error : new Error(String(error)));
        } catch (handlerError) {
          console.error(`${moduleName} | Error in error handler:`, handlerError);
        }
      }

      return null;
    }
  }

  /**
   * Execute a synchronous function with error boundary protection
   * @param fn The function to execute
   * @param context Description of what's being executed
   * @param moduleName Name of the module for logging
   * @param onError Optional error handler
   * @returns The result of the function or null if it failed
   */
  static executeSync<T>(fn: () => T, context: string, moduleName: string, onError?: (error: Error) => void): T | null {
    try {
      return fn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';

      console.error(`${moduleName} | Error in ${context}:`, errorMessage);
      if (errorStack) {
        console.error(`${moduleName} | Stack trace:`, errorStack);
      }

      if (onError) {
        try {
          onError(error instanceof Error ? error : new Error(String(error)));
        } catch (handlerError) {
          console.error(`${moduleName} | Error in error handler:`, handlerError);
        }
      }

      return null;
    }
  }

  /**
   * Execute a function with retry logic
   * @param fn The function to execute
   * @param context Description of what's being executed
   * @param moduleName Name of the module for logging
   * @param maxAttempts Maximum number of attempts (default: 3)
   * @param delayMs Delay between attempts in milliseconds (default: 1000)
   * @returns The result of the function or null if all attempts failed
   */
  static async executeWithRetry<T>(
    fn: () => T | Promise<T>,
    context: string,
    moduleName: string,
    maxAttempts = 3,
    delayMs = 1000,
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const result = await this.execute(fn, context, moduleName);

      if (result !== null) {
        return result;
      }

      if (attempt < maxAttempts) {
        console.warn(`${moduleName} | Retrying ${context} (attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    console.error(`${moduleName} | Failed ${context} after ${maxAttempts} attempts`);
    return null;
  }
}
