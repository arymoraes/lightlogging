"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
const fs = __importStar(require("fs"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const colorNameToAnsi = {
    black: "30",
    red: "31",
    green: "32",
    yellow: "33",
    blue: "34",
    magenta: "35",
    cyan: "36",
    white: "37",
    gray: "90",
};
/**
 * Log class to handle different types of logging with optional file output and colorization.
 */
class Log {
    /**
     * Log class to handle different types of logging with optional file output and colorization.
     */
    constructor(level = LogLevel.Info, config = {}) {
        this.level = level;
        const defaultConfigs = {
            useColors: true,
            timestamps: "log-only",
        };
        this.config = { ...defaultConfigs, ...config };
    }
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    configure(config) {
        this.config = { ...this.config, ...config };
    }
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    shouldLog(level) {
        return level >= this.level;
    }
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    writeToFile(message) {
        if (this.config.logFilePath) {
            if (this.config.logFilePath[this.config.logFilePath.length - 1] === "/") {
                this.config.logFilePath = this.config.logFilePath.slice(0, this.config.logFilePath.length - 1);
            }
            const timestamp = new Date().toISOString();
            const formattedMessage = this.config.timestamps === "log-only"
                ? `[${timestamp}] ${message}`
                : message;
            fs.appendFileSync(`${this.config.logFilePath}/log.log`, formattedMessage + "\n");
        }
    }
    /**
     * Configure or reconfigure the logger.
     * @param {LogConfig} config - New configuration settings to apply.
     */
    colorize(color, message) {
        if (this.config.useColors) {
            return `\x1b[${color}m${message}\x1b[0m`;
        }
        return message;
    }
    /**
     * Log a message with a given log level.
     * @param {LogLevel} logLevel - The level of the log.
     * @param {string} message - The log message.
     * @param {any[]} additional - Additional information to log.
     */
    logMessage(logLevel, message, additional) {
        if (this.shouldLog(logLevel)) {
            const levelMap = {
                [LogLevel.Info]: {
                    label: "INFO",
                    defaultColor: "37",
                    method: console.log,
                },
                [LogLevel.Warn]: {
                    label: "WARN",
                    defaultColor: "33",
                    method: console.warn,
                },
                [LogLevel.Error]: {
                    label: "ERROR",
                    defaultColor: "31",
                    method: console.error,
                },
            };
            const logInfo = levelMap[logLevel];
            const customColor = this.config.customColors?.[LogLevel[logLevel].toLowerCase()];
            let ansiColor = logInfo.defaultColor;
            if (typeof customColor === "string" &&
                colorNameToAnsi.hasOwnProperty(customColor)) {
                ansiColor = colorNameToAnsi[customColor];
            }
            let fullMessage = `[${logInfo.label}] ${message}`;
            if (this.config.timestamps === "all") {
                const timestamp = new Date().toISOString();
                fullMessage = `[${timestamp}] ${fullMessage}`;
            }
            logInfo.method(this.colorize(ansiColor, fullMessage), ...additional);
            this.writeToFile(fullMessage);
        }
    }
    /**
     * Log an informational message.
     * @param {string} message - The informational message.
     * @param {...any} additional - Additional information to log.
     */
    info(message, ...additional) {
        this.logMessage(LogLevel.Info, message, additional);
    }
    /**
     * Log a warning message.
     * @param {string} message - The warning message.
     * @param {...any} additional - Additional information to log.
     */
    warn(message, ...additional) {
        this.logMessage(LogLevel.Warn, message, additional);
    }
    /**
     * Log an error message.
     * @param {string|Error|unknown} message - The error message or Error object.
     * @param {...any} additional - Additional information to log.
     */
    error(message, ...additional) {
        this.logMessage(LogLevel.Error, message, additional);
    }
}
const logInstance = new Log();
exports.default = logInstance;
