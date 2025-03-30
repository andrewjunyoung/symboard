// main.js - Electron main process
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    title: "Oneboard Installer",
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools(); // Uncomment for debugging
}

app.whenReady().then(createWindow);

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

// Handle installation for macOS
ipcMain.on("install-keyboard-mac", (event, layoutPath) => {
  try {
    // If layoutPath is null, use the bundled layout
    const sourcePath = layoutPath || bundledLayoutPath;

    // Create user's Keyboard Layouts directory if it doesn't exist
    const userKeyboardDir = path.join(
      app.getPath("home"),
      "Library/Keyboard Layouts"
    );
    if (!fs.existsSync(userKeyboardDir)) {
      fs.mkdirSync(userKeyboardDir, { recursive: true });
    }

    // Copy the .keylayout file to the user's Keyboard Layouts directory
    const layoutFileName = path.basename(sourcePath);
    const destPath = path.join(userKeyboardDir, layoutFileName);
    fs.copyFileSync(sourcePath, destPath);

    event.reply("installation-result", {
      success: true,
      message:
        "Keyboard layout successfully installed! You need to log out and log back in for the changes to take effect.",
    });
  } catch (error) {
    event.reply("installation-result", {
      success: false,
      message: `Error installing keyboard layout: ${error.message}`,
    });
  }
});

// Handle installation for Windows
ipcMain.on("install-keyboard-windows", (event, layoutPath) => {
  // For Windows, we would need to register the layout with Windows
  // This is more complex and would require a separate installer or registry modifications
  // For now, we'll just show a message with manual instructions

  event.reply("installation-result", {
    success: false,
    message:
      "Windows installation is not supported in this version. Please follow the manual installation instructions.",
  });
});

// Handle file selection
ipcMain.handle("select-layout-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Keyboard Layout Files", extensions: ["keylayout"] }],
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});
