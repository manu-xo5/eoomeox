import { app, BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";
import path from "node:path";
import fs from "node:fs/promises";

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), "preload.cjs"),
    },
  });

  nativeTheme.themeSource = "dark"
  console.log(nativeTheme.themeSource)

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

    const dirPath = result.filePaths[0];
    const filePaths = await fs.readdir(dirPath);
    const fileBins = await Promise.all(
      filePaths.map((relativePath) =>
        fs.readFile(path.join(dirPath, relativePath), "base64"),
      ),
    );
    const files = fileBins.map((file, i) => ({
      name: filePaths[i],
      file: file,
    }));

    return { files, dirPath };
  });

  createWindow();
}

main();
