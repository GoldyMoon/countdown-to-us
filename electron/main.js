const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let petWindow = null;
let dashboardWindow = null;

function createPetWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  petWindow = new BrowserWindow({
    width: 250,
    height: 370,
    x: Math.max(20, width - 290),
    y: Math.max(20, height - 430),
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  petWindow.setAlwaysOnTop(true, "floating");
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.loadFile(path.join(__dirname, "..", "pet", "pet.html"));

  petWindow.on("closed", () => {
    petWindow = null;
  });
}

function createDashboardWindow() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.show();
    dashboardWindow.focus();
    return;
  }

  dashboardWindow = new BrowserWindow({
    width: 980,
    height: 780,
    minWidth: 760,
    minHeight: 600,
    title: "Countdown to Us",
    backgroundColor: "#fff7fb",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  dashboardWindow.loadFile(path.join(__dirname, "..", "index.html"));

  dashboardWindow.on("closed", () => {
    dashboardWindow = null;
  });
}

app.whenReady().then(() => {
  if (process.platform === "darwin" && app.dock) {
    app.dock.hide();
  }

  createPetWindow();

  app.on("activate", () => {
    if (!petWindow) createPetWindow();
  });
});

app.on("window-all-closed", (event) => {
  // Keep the pet alive on macOS unless explicitly quit.
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("open-dashboard", () => {
  createDashboardWindow();
  return true;
});

ipcMain.handle("quit-app", () => {
  app.quit();
  return true;
});

ipcMain.on("move-pet-by", (_event, delta) => {
  if (!petWindow || petWindow.isDestroyed()) return;
  const [x, y] = petWindow.getPosition();
  const display = screen.getDisplayNearestPoint({ x, y });
  const area = display.workArea;

  const nextX = Math.min(
    Math.max(x + Math.round(delta.dx), area.x),
    area.x + area.width - petWindow.getBounds().width
  );
  const nextY = Math.min(
    Math.max(y + Math.round(delta.dy), area.y),
    area.y + area.height - petWindow.getBounds().height
  );

  petWindow.setPosition(nextX, nextY, false);
});
