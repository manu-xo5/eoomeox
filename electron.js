import { app, BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";
import isDev from "electron-is-dev";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), "preload.cjs"),
    },
  });

  nativeTheme.themeSource = "dark";
  if (!isDev) {
    console.info("Creating Production Build");
    win.loadFile(path.join(app.getAppPath(), "/dist/index.html"));
  } else win.loadURL("http://localhost:5173");
}

async function main() {
  await app.whenReady();

  ipcMain.handle("download", (_e, url) => {
    console.log("download()");
    return getFormats(url);
  });
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

function getFormats(url) {
  const ytdlpJsonFormat = spawn(
    "yt-dlp",
    ["-J", "--skip-download", "-F", url],
    { stdio: "pipe" },
  );
  ytdlpJsonFormat.on("spawn", () => {
    console.log("spawned");
  });

  return new Promise((res, rej) => {
    let arr = [];
    ytdlpJsonFormat.stdout.on("data", (data) => {
      arr.push(data.toString());
    });
    ytdlpJsonFormat.on("error", (err) => {
      rej(err.message);
    });

    ytdlpJsonFormat.on("close", (code) => {
      if (code !== 0) {
        rej(`yt-dlp exited with code ${code}`);
      } else {
        res(arr.slice(1));
        ytdlpJsonFormat.kill();
      }
    });
  });
}
