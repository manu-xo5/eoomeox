const { dialog, contextBridge, ipcRenderer } = require("electron");
const fs = require("node:fs");

contextBridge.exposeInMainWorld("fs", fs);
contextBridge.exposeInMainWorld("dialog", {
  openDirDialog: () => ipcRenderer.invoke("openDirDialog"),
});
