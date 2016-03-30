'use strict';


const { app, BrowserWindow } = require('electron');
const { resolve } = require('path');

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(`file://${resolve(__dirname, 'index.html')}`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
