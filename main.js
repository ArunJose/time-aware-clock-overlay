const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
  screen,
} = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let overlayWindow;
let tray;
let showOverlayInterval;
let hideOverlayTimeout;

let settings = {
  intervalSeconds: 60,
  durationSeconds: 10,
};

function createWindow() {
  if (mainWindow) {
    mainWindow.show();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false, // Initially create the window hidden
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("ready-to-show", () => {
    mainWindow.show(); // Show the window when it's ready
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createOverlayWindow() {
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 200,
    height: 100,
    x: Math.floor(screenWidth / 2 - 100),
    y: Math.floor(screenHeight / 2 - 50),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true);
  overlayWindow.loadFile("overlay.html");
  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.hide();
}

function showOverlay() {
  if (overlayWindow) {
    const { width: screenWidth, height: screenHeight } =
      screen.getPrimaryDisplay().workAreaSize;

    // Ensure the overlay window size is correct
    overlayWindow.setSize(200, 100);

    // Reposition the overlay window to the center of the screen
    overlayWindow.setPosition(
      Math.floor(screenWidth / 2 - 100),
      Math.floor(screenHeight / 2 - 50)
    );

    overlayWindow.show();
    clearTimeout(hideOverlayTimeout);
    hideOverlayTimeout = setTimeout(() => {
      overlayWindow.hide();
    }, settings.durationSeconds * 1000);
  }
}

function startOverlayTimer() {
  clearInterval(showOverlayInterval);
  clearTimeout(hideOverlayTimeout);

  showOverlayInterval = setInterval(
    showOverlay,
    settings.intervalSeconds * 1000
  );
}

function createTray() {
  let trayIcon;
  const iconPath = path.join(__dirname, "icon.png");

  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  } else {
    console.warn("icon.png not found, using default icon");
    trayIcon = nativeImage.createEmpty();
  }

  try {
    tray = new Tray(trayIcon);
    tray.setToolTip("TimeAware App");

    if (trayIcon.isEmpty()) {
      tray.setTitle("TA");
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Settings",
        click: () => {
          if (mainWindow === null) {
            createWindow();
          } else {
            mainWindow.show();
          }
        },
      },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray.setContextMenu(contextMenu);
  } catch (error) {
    console.error("Failed to create tray:", error);
  }
}

app.whenReady().then(() => {
  createWindow();
  createOverlayWindow();
  createTray();
  startOverlayTimer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("update-settings", (event, newSettings) => {
  settings = newSettings;
  startOverlayTimer();
});

ipcMain.on("get-settings", (event) => {
  event.reply("settings", settings);
});
