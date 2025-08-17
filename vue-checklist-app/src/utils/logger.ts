/**
 * Logger utility for development and production environments
 * Provides consistent logging with levels and environment awareness
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logLevel: LogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR

  debug(...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug('[DEBUG]', ...args)
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('[ERROR]', ...args)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
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

  // Table logging for structured data
  table(data: any): void {
    if (this.isDevelopment) {
      console.table(data)
    }
  }

  // Performance timing
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
}

export const logger = new Logger()