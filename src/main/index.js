'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { exec, spawn, execSync } from 'child_process'


const isDevelopment = process.env.NODE_ENV !== 'production'
// const shell = require("./exec.js").shell
const mlperfImage = "cr.myelintek.com/mlcommon/mlperf-inference:x86_64"

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({webPreferences: {nodeIntegration: true}})

  // if (isDevelopment) {
  //   window.webContents.openDevTools()
  // }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
  console.log("app on activate")
})

function checkPrivilege() {
  try {
    execSync("NET SESSION");
  } catch (err) {
    dialog.showErrorBox("requireAdministrator", "please start with administrator privilege")
  }
}

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  checkPrivilege();
})

function checkWSL() {
  try {
    execSync("wsl --status");
    mainWindow.webContents.send("wsl:pass");
  } catch (err) {
    mainWindow.webContents.send("wsl:fail");
  }
}

function checkUbuntu() {
  try {
    let res = execSync("wsl --list", { maxBuffer: 1024 })
    // console.log(res);
    let so = res.toString("utf8").replace(/\0/g, '');
    if (so.includes("Ubuntu-20.04")) {
      mainWindow.webContents.send("ub:pass");
    }
  } catch (err) {
    console.log(err.message)
    mainWindow.webContents.send("ub:fail");
  }
}

function checkDocker() {
  try {
    let res = execSync("wsl service docker status");
    let so = res.toString('utf8').replace(/\0/g, '');
    mainWindow.webContents.send("docker:pass");
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("docker:fail");
    mainWindow.webContents.send("docker:note", msg);
  }
}

function setupEnv() {
  try {
    execSync("wsl mkdir -p /mnt/c/mlperf /mnt/c/mlperf/data /mnt/c/mlperf/models /mnt/c/mlperf/preprocessed_data")
    mainWindow.webContents.send("env:pass");
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("env:fail", msg);
  }
}

function imgPull() {
  try {
    console.log('Hi')
    let pullprocess = exec("wsl sudo docker pull cr.myelintek.com/mlcommon/mlperf-inference:x86_64")
    pullprocess.stdout.on('data', function (data) {
      console.log(data);
      mainWindow.webContents.send("docker:pullMsg", data);
    })
    // pullprocess.stderr.on('data', function (data) {
    //   console.log(data)
    // })
  } catch (err) {
    // let msg = err.output.toString()
    console.log(err)
    // mainWindow.webContents.send("env:fail", msg);
  }
}

function checkImage() {
  try {
    let res = execSync("wsl sudo docker images");
    let so = res.toString('utf8').replace(/\0/g, '');
    console.log(so);
    if (so.includes(mlperfImage)) {
      mainWindow.webContents.send("docker:imgReady")
    }
  } catch (err) {
    let msg = err.output.toString()
    console.log(msg)
  }
}

function imgRun() {
  try {
    execSync("wsl mkdir -p /mnt/c/mlperf /mnt/c/mlperf/data /mnt/c/mlperf/models /mnt/c/mlperf/preprocessed_data")
    mainWindow.webContents.send("env:pass");
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("env:fail", msg);
  }
}

ipcMain.on('wsl:check', () => {
  checkWSL();
  checkUbuntu();
  checkDocker();
  setupEnv();
  checkImage();
});

ipcMain.on('wsl:envSetup', () => {
  setupEnv();
});

ipcMain.on('docker:pull', () => {
  imgPull();
})

ipcMain.on('docker:run', () => {
  imgRun();
})