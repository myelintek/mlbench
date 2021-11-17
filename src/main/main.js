'use strict'

import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { exec, spawn, execSync } from 'child_process'


const isDevelopment = process.env.NODE_ENV !== 'production'
// const shell = require("./exec.js").shell
const mlperfImage = "cr.myelintek.com/mlcommon/mlperf-inference:x86_64"

const MLPERF_SCRATCH_PATH = "/mnt/c/mlcommon"

const CONTAINER_NAME = "mlbenchmarks"

var hostname

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1100,
    height: 800,
    title: "MLPerf - Inferencing",
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

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

  const mainMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(mainMenu);

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
    let res = execSync("wsl --status");
    let so = res.toString("utf8").replace(/\0/g, '');
    mainWindow.webContents.send("wsl:pass");
    mainWindow.webContents.send("wsl:note", so);
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
      console.log(so)
      mainWindow.webContents.send("ub:note", so)
    }
  } catch (err) {
    console.log(err.message)
    mainWindow.webContents.send("ub:fail");
  }
}

function sudonpStatus() {
  try {
    let res = execSync("wsl sudo -n true")
    mainWindow.webContents.send("sudo:pass")
  } catch (err) {
    mainWindow.webContents.send("sudo:fail")
  }
}

function checkDocker() {
  try {
    // let res = execSync("wsl service docker status");
    let res = execSync('wsl bash -c "service docker status | grep Active"');
    let so = res.toString('utf8');
    if (so.includes('running')) {
      mainWindow.webContents.send("docker:pass");
      res = execSync("wsl dockerd --version");
      so = res.toString('utf8').replace(/\0/g, '');
      mainWindow.webContents.send("docker:note", so);
    }
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("docker:fail");
    mainWindow.webContents.send("docker:note", msg);
  }
}

function setupEnv() {
  try {
    execSync("wsl mkdir -p "+MLPERF_SCRATCH_PATH+" "+MLPERF_SCRATCH_PATH+"/data "+MLPERF_SCRATCH_PATH+"/models "+MLPERF_SCRATCH_PATH+"/preprocessed_data")
    execSync("wsl export MLPERF_SCRATCH_PATH="+MLPERF_SCRATCH_PATH);
    mainWindow.webContents.send("env:pass");
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("env:fail", msg);
  }
}

function imgPull() {
  try {
    console.log('Hi')
    let pullprocess = exec("wsl sudo docker pull " + mlperfImage)
    pullprocess.stdout.on('data', function (data) {
      console.log(data);
      mainWindow.webContents.send("docker:pullMsg", data);
      mainWindow.webContents.send("docker:imgReady");
    })
    // pullprocess.stderr.on('data', function (data) {
    //   console.log(data)
    // })
  } catch (err) {
    let msg = err.output.toString()
    console.log(err)
    mainWindow.webContents.send("docker:pullMsg", msg);
    // mainWindow.webContents.send("env:fail", msg);
  }
}

function checkNvidia() {
  try {
    let res = execSync("wsl nvidia-smi");
    let so = res.toString('utf8');
    mainWindow.webContents.send("nv:pass")
    mainWindow.webContents.send("nv:status", so)
  } catch (err) {
    let msg = err.output.toString()
    console.log(msg)
    mainWindow.webContents.send("nv:fail");
    mainWindow.webContents.send("nv:status", msg);
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


function echoContainer(){
// Make sure that the container is up and running by sending an echo command inside the container
  try{
    let res1 = execSync('wsl bash -c "docker exec mlperf-inference-mlsteam-x86_64 echo \"Hello_world\" " ');
    let so1 = res1.toString('utf8').replace(/\0/g, '');
    if  (so1.includes("Hello_world")) {
      mainWindow.webContents.send("docker:run_pass");
    } else{
      console.log(so1)
      mainWindow.webContents.send("docker:run_fail");
    }
  } catch (err){
    let msg = err.output.toString()
    console.log(msg)
  }
}

function runDocker() {

  try{
    // execSync("wsl export MLPERF_SCRATCH_PATH="+MLPERF_SCRATCH_PATH);

    // hostname = execSync("wsl hostname").toString('utf8').replace(/\0/g, '');
    // execSync("wsl nvidia-docker run --rm -di -w /work \
    // -v /home/mlsteam/inference_results_v1.1/closed/MyelinTek:/work -v /home/mlsteam:/mnt//home/mlsteam \
    // --cap-add SYS_ADMIN --cap-add SYS_TIME \
    // -e NVIDIA_VISIBLE_DEVICES=all \
    // --shm-size=32gb \
    // -v /etc/timezone:/etc/timezone:ro -v /etc/localtime:/etc/localtime:ro \
    // --security-opt apparmor=unconfined --security-opt seccomp=unconfined \
    // --name "+CONTAINER_NAME+" -h "+CONTAINER_NAME+" --add-host "+CONTAINER_NAME+":127.0.0.1 \
    // --user 1000:1000 --net host --device /dev/fuse \
    // -v $(MLPERF_SCRATCH_PATH):$(MLPERF_SCRATCH_PATH)  \
    // -e MLPERF_SCRATCH_PATH=$(MLPERF_SCRATCH_PATH) \
    // -e HOST_HOSTNAME="+  hostname+ " "+mlperfImage);

    // Need to check if we already have a container running
    let res1 = execSync('wsl bash -c "docker ps" ');
    let so1 = res1.toString('utf8').replace(/\0/g, '');
    if (so1.includes("mlperf-inference-mlsteam-x86_64")){
      console.log("Container already running! Don't need to build")
    } else{
      // Probably don't need to build the image if we have already pulled it, should be the same image, just need to map the paths correctly using prebuild
      try{
        execSync("wsl export NO_BUILD=1");
        let res1 = execSync('wsl bash -c "cd inference_results_v1.1/closed/MyelinTek && make prebuild" ');
        let so1 = res1.toString('utf8').replace(/\0/g, '');
        
      } catch (err){
        let msg = err.output.toString()
        console.log(msg)
      }
    }
    echoContainer()
  } catch (err) {
    let msg = err.output.toString()
    console.log(msg)
  }
}

function imgRun() {
  try {
    // Clone the repo
    let res = execSync("wsl git clone https://github.com/myelintek/inference_results_v1.1 --branch wsl --single-branch");
    let so = res.toString('utf8').replace(/\0/g, '');
    console.log(so);

    runDocker()

  } catch (err) {
    let msg = err.output.toString()
    if  (msg.includes("exists")){
      // Still pass if folder's already there
      try{
        runDocker()

      } catch (err2) {
        let msg = err2.output.toString();
        console.log(msg)
        mainWindow.webContents.send("docker:run_fail", msg);
      }
      
    }
    else{
      mainWindow.webContents.send("docker:run_fail", msg);
    }
  }
}


function list_supported_systems(){
  try{
    // Get gpu name from nvidia-smi
    let res = execSync('wsl bash -c "nvidia-smi --query-gpu=gpu_name --format=csv | sed 1d "');
    let gpu_name_raw = res.toString('utf8').replace(/\0/g, '');
    let gpu_name_raw_1 = gpu_name_raw.toString('utf8').replace(/\n/g, '');
    let gpu_name = gpu_name_raw_1.replace('NVIDIA ', '');
    console.log(gpu_name)
    // Send a command to execute a python script inside our running docker container
    let res1 = execSync('wsl bash -c "docker exec mlperf-inference-mlsteam-x86_64 python print_supported_systems.py"');
    let supported_systems = res1.toString('utf8').replace(/\0/g, '');
    console.log(supported_systems)
    if (supported_systems.includes(gpu_name)){
      console.log("Current system "+ gpu_name+" is supported!");
    } else{
      console.log("Current system "+ gpu_name+" is not supported, need to add manually");
    }
  }catch (err){
    let msg = err.output.toString();
    console.log(msg)
  }
  
}


ipcMain.on('wsl:check', () => {
  console.log("wsl:check");
  checkWSL();
  checkUbuntu();
  sudonpStatus();
  checkDocker();
  setupEnv();
  checkNvidia();
  // checkImage();
});

ipcMain.on('wsl:envSetup', () => {
  setupEnv();
});

ipcMain.on('docker:pull', () => {
  imgPull();
})

ipcMain.on('docker:run', () => {
  imgRun();
  list_supported_systems();
})