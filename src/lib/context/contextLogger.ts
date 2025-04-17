
/**
 * Specialized logger for context-related operations
 * with consistent formatting and log levels
 */

type LogData = Record<string, any>;

class ContextLogger {
  /**
   * Log informational message
   */
  info(message: string, data?: LogData) {
    console.log(`[Sage Init] 🔄 ${message}`, data || '');
  }

  /**
   * Log success message
   */
  success(message: string, data?: LogData) {
    console.log(`[Sage Init] ✅ ${message}`, data || '');
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: LogData) {
    console.warn(`[Sage Init] ⚠️ ${message}`, data || '');
  }

  /**
   * Log error message
   */
  error(message: string, data?: LogData) {
    console.error(`[Sage Init] ❌ ${message}`, data || '');
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, data?: LogData) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Sage Init] 🐞 ${message}`, data || '');
    }
  }
}

export const contextLogger = new ContextLogger();
