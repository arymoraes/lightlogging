import fs from "fs";
import logInstance, { Log, LogConfig, LogLevel } from "../index";
import path from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  appendFileSync: jest.fn(),
  appendFile: jest.fn(),
  readdirSync: jest.fn().mockReturnValue([]),
}));

describe("Log Instance", () => {
  it("should log a warning message", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation();
    logInstance.warn("This is a warning");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should log an error message", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    logInstance.error("This is an error");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("should log an info message", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();
    logInstance.info("This is an info");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("Log Class", () => {
  let log: Log;
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const period = `${month}${year}`;

  const logFilePath = "./logs";
  const pathLogsPeriod = path.join(logFilePath, period);


  beforeEach(() => {
    log = new Log();
    require('fs').appendFileSync.mockClear();
  });

  it("should set initial configuration properly", () => {
    const defaultConfig = {
      useColors: true,
      timestamps: "log-only",
      icons:false,
      logFilePath: false,
    };

    expect(log["config"]).toEqual(defaultConfig);
  });

  it("should reconfigure settings", () => {
    const newConfig: LogConfig = {
      logFilePath: "./logs",
      useColors: false,
    };
    log.configure(newConfig);
    expect((log as any).config).toEqual({
      ...(log as any).config,
      ...newConfig,
    });
  });

  it("should not log if the level is below the set level", () => {
    log = new Log(LogLevel.Error);
    const consoleSpy = jest.spyOn(console, "info").mockImplementation();
    log.info("This is info");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should write to a file if logFilePath is set", () => {
    const logMessage = "This is a log message";
    log.configure({ logFilePath, timestamps: "none" });
    log.info(logMessage);
   
  
    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(logMessage),
      expect.any(Function)
    );
  });

  it("should write to a file if logFilePath is set and an object is passed", () => {
    const logMessage = { message: "This is a log message" };
    log.configure({ logFilePath, timestamps: "none" });
    log.info(logMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(JSON.stringify(logMessage)),
      expect.any(Function)
    );
  });

  it("should write to a file if logFilePath is set and an error object is passed", () => {
    const logMessage = new Error("This is a log message");
    log.configure({ logFilePath, timestamps: "none" });
    log.info(logMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(logMessage.message),
      expect.any(Function)
    );
  });

  it("should write to a file if logFilePath is set and an array is passed", () => {
    const logMessage = ["This is a log message"];
    log.configure({ logFilePath, timestamps: "none" });
    log.info(logMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(JSON.stringify(logMessage)),
      expect.any(Function)
    );

  });

  it("should write to a file if logFilePath is set and timestamps are set to log-only", () => {
    const logMessage = "This is a log message";
  
    log.configure({ logFilePath, timestamps: "log-only" });
    log.info(logMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(logMessage),
      expect.any(Function)
    );
  });

  it("should write to a file if logFilePath is set and timestamps are set to all", () => {
    const logMessage = "This is a log message";

    log.configure({ logFilePath, timestamps: "all" });
    log.info(logMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
      path.normalize(`${pathLogsPeriod}/${day}.txt`),
      expect.stringMatching(logMessage),
      expect.any(Function)
    );
  });
});
