const { dialog, contextBridge, ipcRenderer } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("dialog", {
  openDirDialog: () => ipcRenderer.invoke("openDirDialog"),
});

contextBridge.exposeInMainWorld("x", {
  openDirDialog: async () => {
    const dirPath = "/home/norm/music";
    const filePaths = await fs.promises.readdir(dirPath);
    const fileBins = await Promise.all(
      filePaths.map((relativePath) =>
        fs.promises.readFile(path.join(dirPath, relativePath), "base64"),
      ),
    );
    const files = fileBins.map((file, i) => ({
      name: filePaths[i],
      file: file,
    }));

    return { dirPath, files };
  },
});
