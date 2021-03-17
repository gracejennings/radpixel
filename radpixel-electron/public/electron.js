const electron = require("electron");
const path = require("path");
const url = require("url");

// Electron logs are stored at ~/Library/Logs/radpixel-electron/
const log = require('electron-log');

const { app } = electron;
const { BrowserWindow } = electron;

const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  const startUrl = process.env.DEV
    ? "http://localhost:3000"
    : url.format({
        pathname: path.join(__dirname, "/../build/index.html"),
        protocol: "file:",
        slashes: true,
      });
  mainWindow = new BrowserWindow({
    title: 'RadPixel Radiation Detector',
    width: 1200,
    height: 1000,
    webPreferences: { 
      nodeIntegration: true,
      enableRemoteModule: true,
    }
  });

  mainWindow.loadURL(startUrl);
  process.env.DEV && mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ------------------- set up event listeners here --------------------

// temporary variable to store data while background
// process is ready to start processing
let cache = {
	data: undefined,
};

// a window object outside the function scope prevents
// the object from being garbage collected ???
let hiddenWindow;

// This event listener will listen for request
// from visible renderer process
// args.data comes in as an array of strings
ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {

  log.info("starting background...");

	const backgroundFileUrl = url.format({
		pathname: path.join(__dirname, `../background/startup_aggregate.html`),
		protocol: 'file:',
		slashes: true,
	});
	hiddenWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	hiddenWindow.loadURL(backgroundFileUrl);

	hiddenWindow.webContents.openDevTools();

	hiddenWindow.on('closed', () => {
		hiddenWindow = null;
	});

  // store this data; we'll get it later
	cache.data = args.data;
});

// This event listener will listen for data being sent back
// from the background renderer process
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
  //log.info("message from background (electron.js): ", args);
	mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
});


// listening for the confirmation that the hidden renderer is ready
ipcMain.on('BACKGROUND_READY', (event, args) => {
	event.reply('START_PROCESSING', {
		data: cache.data,
	});
});

