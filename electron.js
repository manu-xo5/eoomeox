import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs/promises"

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), "preload.cjs"),
    },
  });

  if (process.env.NODE_ENV === "production") win.loadFile("/dist/index.html");
  else win.loadURL("http://localhost:5173");
}

async function main() {
  await app.whenReady();

  ipcMain.handle("openDirDialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (result.canceled) return null;

    return await fs.readdir(result.filePaths[0])
  });

  createWindow();
}

main();
