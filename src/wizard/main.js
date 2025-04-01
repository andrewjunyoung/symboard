import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let bundledLayoutPath;

function createWindow() {
  // Set path to bundled layout file
  bundledLayoutPath = path.join(__dirname, "../static/iso_odvorak.keylayout");

  // If packaged:
  if (app.isPackaged) {
    bundledLayoutPath = path.join(
      process.resourcesPath,
      "static/iso_odvorak.keylayout"
    );
  }

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

  mainWindow.loadFile(path.join(__dirname, "index.html"));
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
