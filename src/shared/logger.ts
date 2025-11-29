// shared/logger.ts
// Centralized logging utility with debug mode support

import { Config } from './config';

declare function GetConvar(convar: string, defaultValue: string): string;

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Color codes for console output
 */
const Colors = {
  DEBUG: '^5', // Purple
  INFO: '^2', // Green
  WARN: '^3', // Yellow
  ERROR: '^1', // Red
  RESET: '^7', // White
} as const;

/**
 * Logger class for consistent logging across the resource
 */
class Logger {
  private debugMode: boolean;
  private resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.debugMode = Config.DEBUG_MODE;
  }

  /**
   * Update debug mode (e.g., from convar)
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Format log message with color and level
   */
  private format(level: LogLevel, message: string, context?: string): string {
    const color = Colors[level];
    const ctx = context ? `[${context}]` : '';
    return `${color}[${this.resourceName}]${Colors.RESET} ${color}[${level}]${Colors.RESET} ${ctx} ${message}`;
  }

  /**
   * Log debug message (only in debug mode)
   */
  debug(message: string, context?: string): void {
    if (this.debugMode) {
      console.log(this.format(LogLevel.DEBUG, message, context));
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: string): void {
    console.log(this.format(LogLevel.INFO, message, context));
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string): void {
    console.log(this.format(LogLevel.WARN, message, context));
  }

  /**
   * Log error message
   */
  error(message: string, context?: string, error?: Error): void {
    console.log(this.format(LogLevel.ERROR, message, context));
    if (error && this.debugMode) {
      console.error(error);
    }
  }
}

// Export singleton instance
export const logger = new Logger(Config.MODULE_NAME);

// Helper function to update debug mode from convar
export function initLogger(resourceName: string, debugConvar: string = 'debug_mode'): void {
  const debugMode = typeof GetConvar !== 'undefined' && GetConvar(debugConvar, 'false') === 'true';
  logger.setDebugMode(debugMode);
  logger.info(`Logger initialized (Debug: ${debugMode})`, 'INIT');
}
