# Light Logging

[![GitHub](https://img.shields.io/badge/-GitHub-black?logo=github&logoColor=white)](https://github.com/arymoraes/lightlogging)

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
  logFilePath: false, // You can passa a boolean, case true will create a folder log in root project, or pass the path of a folder that you want to create the folders and files for logs
  icons: true, // To show icons on logs '✔ ⚠️  X'
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
  logFilePath: false, // No file output
  icons: false,
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
