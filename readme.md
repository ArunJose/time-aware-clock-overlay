# TimeAware App (Clock overlay app for PC)

TimeAware is an Electron-based desktop application that displays a clock overlay at regular intervals, helping users stay aware of time while working.

## Features

- Clock overlay appears at customizable intervals
- Configurable display duration
- System tray integration for easy access
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory in your terminal.
3. Run the following command to install dependencies:

```
npm install
```

## Running the App

To start the app in development mode, run:

```
npm start
```

## Building the App

### For all platforms:

```
npm run dist
```

### For specific platforms:

- Windows:

  ```
  npm run dist:win
  ```

- macOS (requires a Mac):

  ```
  npm run dist:mac
  ```

- Linux:
  ```
  npm run dist:linux
  ```

The packaged applications will be available in the `dist` folder after building.

## Configuration

You can adjust the overlay interval and duration in the settings window, accessible via the system tray icon.

## Icon

Place your app icon as `icon.png` (256x256 pixels recommended) in the project root directory. For building, you'll also need:

- `icon.ico` for Windows
- `icon.icns` for macOS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
