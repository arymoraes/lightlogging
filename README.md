# Light Logging

## Description

A lightweight logging library for Node.js applications with optional colorization and file output.

## Installation

```bash
npm install lightlogging
```

or with yarn:

```bash
yarn add lightlogging
```

## Usage

```javascript
import Log from "lightlogging";

Log.info("Server running at http://localhost:3000");
Log.warn("isSomeFunction is deprecated.");
Log.error("Failed to connect to database.");
```

## Config

```javascript
Log.configure({
  logFilePath: "./", // Path to log file directory, file name is log.log
  customColors: {
    info: "green", // Colors can be any of the supported colors
    error: "magenta",
    warn: "cyan",
  },
  timestamps: "all", // "all", "log-only", "none"
});
```

Default configs are:

```javascript
Log.configure({
  logFilePath: undefined, // No file output
  customColors: {
    info: "white",
    error: "red",
    warn: "yellow",
  },
  timestamps: "log-only",
});
```

## Supported Colors

- black, red, green, yellow, blue, magenta, cyan, white, gray
