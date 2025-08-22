/**
 * Logger Service
 * Centralized logging with environment-aware output
 */

type LogArgument = string | number | boolean | object | Error | null | undefined | unknown

interface LogLevel {
  debug: (...args: LogArgument[]) => void
  info: (...args: LogArgument[]) => void
  warn: (...args: LogArgument[]) => void
  error: (...args: LogArgument[]) => void
}

class Logger implements LogLevel {
  private isDevelopment = import.meta.env.DEV
  private isProduction = import.meta.env.PROD

  debug(...args: LogArgument[]): void {
    if (this.isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  }

  info(...args: LogArgument[]): void {
    if (this.isDevelopment) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args: LogArgument[]): void {
    // Warnings are shown in both dev and prod
    console.warn('[WARN]', ...args)
  }

  error(...args: LogArgument[]): void {
    // Errors are always shown
    console.error('[ERROR]', ...args)
    
    // In production, you might want to send errors to a monitoring service
    if (this.isProduction) {
      this.sendToMonitoring(args)
    }
  }

  private sendToMonitoring(args: LogArgument[]): void {
    // TODO: Integrate with error monitoring service like Sentry
    // For now, this is a placeholder
  }

  // Utility method for performance logging
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label)
    }
  }

  // Table logging for development
  table(data: object | unknown[]): void {
    if (this.isDevelopment) {
      console.table(data)
    }
  }

  // Group logging for better organization
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd()
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export default
export default logger