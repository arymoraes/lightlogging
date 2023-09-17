declare enum LogLevel {
    Info = 0,
    Warn = 1,
    Error = 2
}
type ColorName = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";
declare const colorNameToAnsi: Record<ColorName, string>;
interface LogConfig {
    logFilePath?: string;
    useColors?: boolean;
    timestamps?: "none" | "log-only" | "all";
    customColors?: {
        info?: keyof typeof colorNameToAnsi;
        warn?: keyof typeof colorNameToAnsi;
        error?: keyof typeof colorNameToAnsi;
    };
}
/**
 * Log class to handle different types of logging with optional file output and colorization.
 */
declare class Log {
    private level;
    private config;
    /**
     * Log class to handle different types of logging with optional file output and colorization.
     */
    constructor(level?: LogLevel, config?: LogConfig);
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    configure(config: LogConfig): void;
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    private shouldLog;
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    private writeToFile;
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    private colorize;
    /**
     * Log a message with a given log level.
     * @param {LogLevel} logLevel - The level of the log.
     * @param {string} message - The log message.
     * @param {any[]} additional - Additional information to log.
     */
    private logMessage;
    /**
     * Log an informational message.
     * @param {string} message - The informational message.
     * @param {...any} additional - Additional information to log.
     */
    info(message: string, ...additional: any[]): void;
    /**
     * Log a warning message.
     * @param {string} message - The warning message.
     * @param {...any} additional - Additional information to log.
     */
    warn(message: string, ...additional: any[]): void;
    /**
     * Log an error message.
     * @param {string|Error|unknown} message - The error message or Error object.
     * @param {...any} additional - Additional information to log.
     */
    error(message: string, ...additional: any[]): void;
}
declare const logInstance: Log;
export default logInstance;
export { LogLevel, LogConfig };
