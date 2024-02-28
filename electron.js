import { app, BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";
import isDev from "electron-is-dev";
import path from "node:path";
import fs from "node:fs/promises";
import { exec, spawn } from "node:child_process";

/** @type {BrowserWindow | null} */
globalThis.mainWindow = null;

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

  globalThis.mainWindow = win;
}

async function main() {
  await app.whenReady();

  ipcMain.handle("getFormats", (_e, url) => {
    console.log("getFormats() spawned");
    return getFormats(url);
  });

  ipcMain.handle("download", (_e, ...args) => {
    console.log("download()");

    console.log(...args);
    return downloadVideoUsingYtDlp(...args);
  });
  ipcMain.handle("openDirDialog", handleOpenDir);
  ipcMain.handle("getCover", getCover);

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

async function handleOpenDir() {
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
}
/**
 * @param {string} url
 * @param {string} formatExt
 * @param {string} formatId
 */
function downloadVideoUsingYtDlp(url, _formatExt, formatId) {
  const ytdlp = spawn("yt-dlp", [
    url,
    "-o",
    `~/music/%(title)s.%(ext)s`,
    "-f",
    formatId,
    "-w",
    "--no-part",
    "--embed-thumbnail",
  ]);
  let data = "";

  return new Promise((res, rej) => {
    ytdlp.stdout.on("data", (stdData) => {
      console.log(data.toString());
      data += stdData.toString();

      globalThis.mainWindow.webContents.send("downloadListener", stdData.toString())
      stdData.toString();
    });

    ytdlp.stderr.on("data", (data) => {
      console.error(data.toString());
      rej(data.toString());
      return false;
    });

    ytdlp.on("error", (_err) => {
      rej("yt-dlp not found. Please install it.");
      return false;
    });

    ytdlp.on("close", (_code) => {
      res(data);
      return true;
    });
  });
}

/**
 * @param {import("electron").IpcMainInvokeEvent} _e
 * @param {string} filePaths
 */
async function getCover(_e, filePath) {
  const cover = exec(`ffmpeg -i ${filePath} -an -vcodec copy TMP_cover.jpg`);
  await new Promise((res, rej) => {
    let data = "";
    cover.stdout.on("data", (stdData) => {
      data += stdData.toString();
    });
    cover.stderr.on("data", (data) => {
      console.error(data.toString());
      rej(data.toString());
    });

    cover.on("error", (_err) => {
      rej("yt-dlp not found. Please install it.");
    });

    cover.on("close", (_code) => {
      res(data);
    });
  });

  // const coverB64 = await fs.readFile("TMP_cover.jpg", "base64");
  // return coverB64;
  return "";
}
