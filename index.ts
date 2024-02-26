import * as fs from "fs";
import path from 'path';
enum LogLevel {
  Info,
  Warn,
  Error,
}

type ColorName =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray";

const colorNameToAnsi: Record<ColorName, string> = {
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

interface LogConfig {
  logFilePath?: boolean | string;
  useColors?: boolean;
  timestamps?: "none" | "log-only" | "all";
  icons?: boolean;
  customColors?: {
    info?: keyof typeof colorNameToAnsi;
    warn?: keyof typeof colorNameToAnsi;
    error?: keyof typeof colorNameToAnsi;
  };
}
/**
 * Log class to handle different types of logging with optional file output and colorization.
 */
class Log {
  private level: LogLevel;
  private config: LogConfig;

  /**
   * Log class to handle different types of logging with optional file output and colorization.
   */
  constructor(level: LogLevel = LogLevel.Info, config: LogConfig = {}) {
    this.level = level;
    const defaultConfigs: Partial<LogConfig> = {
      useColors: true,
      timestamps: "log-only",
      logFilePath: false,
      icons:true,
    };

    this.config = { ...defaultConfigs, ...config };
  }

  /**
   * Configure or reconfigure the logger.
   * @param {LogConfig} config - New configuration settings to apply.
   */
  public configure(config: LogConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Configure or reconfigure the logger.
   * @param {LogConfig} config - New configuration settings to apply.
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private getLogFilePath(): string | null | undefined {
    if (!this.config.logFilePath) {
      return null;
    }

    if (typeof this.config.logFilePath) {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const period = `${month}${year}`;

      const pathLogs = typeof this.config.logFilePath === 'string'  ? this.config.logFilePath : path.join(process.cwd(), 'logs') 


      const pathLogsPeriod = path.join(pathLogs, period);

      if (!fs.existsSync(pathLogs)) {
        fs.mkdirSync(pathLogs);
      }

      if (!fs.existsSync(pathLogsPeriod)) {
        fs.mkdirSync(pathLogsPeriod);

        const folders = fs.readdirSync(pathLogs, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => ({
            name: dirent.name,
            date: new Date(
              Number(dirent.name.substring(2, 6)),
              Number(dirent.name.substring(0, 2)),
              1,
            ),
          }))
          .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
          });

        if (folders.length > 6) {
          const lastFolder = folders[folders.length - 1].name;
          const lastFolderPath = path.join(pathLogs, lastFolder);

          fs.rmdirSync(lastFolderPath, { recursive: true });
        }
      }

      return path.join(pathLogsPeriod, `${day}.txt`);
    }
  }

  /**
   * Configure or reconfigure the logger.
   * @param {LogConfig} config - New configuration settings to apply.
   */
  private writeToFile(message: any) {
    const parsedMessage =
      typeof message === "string" ? message : JSON.stringify(message);
    const logFilePath = this.getLogFilePath();

    if (logFilePath) {
      const timestamp = new Date().toISOString();

      const formattedMessage =
        this.config.timestamps === "log-only"
          ? `[${timestamp}] ${parsedMessage}`
          : parsedMessage;

      if (fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, formattedMessage + "\n");
      } else {
        fs.appendFile(logFilePath, formattedMessage + "\n", () => {});
      }
    }
  }


  /**
   * Configure or reconfigure the logger.
   * @param {LogConfig} config - New configuration settings to apply.
   */
  private colorize(color: string, message: string): string {
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
  private logMessage(logLevel: LogLevel, message: string, additional: any[]) {
    if (this.shouldLog(logLevel)) {
      const levelMap = {
        [LogLevel.Info]: {
          label: this.config.icons ? '\x1b[32m✔\x1b[0m INFO': 'INFO',
          defaultColor: "37",
          method: console.log,
        },
        [LogLevel.Warn]: {
          label: this.config.icons ? '⚠️ WARN' : 'WARN',
          defaultColor: "33", 
          method: console.warn,
        },
        [LogLevel.Error]: {
          label: this.config.icons ? '❌ ERROR' : 'ERROR',
          defaultColor: "31",
          method: console.error,
        },
      };

      const logInfo = levelMap[logLevel];
      const customColor =
        this.config.customColors?.[
          LogLevel[
            logLevel
          ].toLowerCase() as keyof typeof this.config.customColors
        ];
      let ansiColor = logInfo.defaultColor;

      if (
        typeof customColor === "string" &&
        colorNameToAnsi.hasOwnProperty(customColor)
      ) {
        ansiColor = colorNameToAnsi[customColor];
      }

      let fullMessage = `[${logInfo.label}] ${
        typeof message === "string" ? message : JSON.stringify(message)
      }`;

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
   * @param {any} message - The informational message.
   * @param {...any} additional - Additional information to log.
   */
  public info(message: any, ...additional: any[]) {
    this.logMessage(LogLevel.Info, message, additional);
  }

  /**
   * Log a warning message.
   * @param {any} message - The warning message.
   * @param {...any} additional - Additional information to log.
   */
  public warn(message: any, ...additional: any[]) {
    this.logMessage(LogLevel.Warn, message, additional);
  }

  /**
   * Log an error message.
   * @param {any} message - The error message or Error object.
   * @param {...any} additional - Additional information to log.
   */
  public error(message: any, ...additional: any[]) {
    this.logMessage(LogLevel.Error, message, additional);
  }
}

const logInstance = new Log();
export default logInstance;
export { LogLevel, LogConfig, Log };
