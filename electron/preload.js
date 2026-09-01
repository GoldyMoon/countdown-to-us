const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopPet", {
  openDashboard: () => ipcRenderer.invoke("open-dashboard"),
  quit: () => ipcRenderer.invoke("quit-app"),
  moveBy: (dx, dy) => ipcRenderer.send("move-pet-by", { dx, dy })
});
