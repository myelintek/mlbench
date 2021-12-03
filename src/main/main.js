'use strict'

import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { exec, spawn, execSync } from 'child_process'


const isDevelopment = process.env.NODE_ENV !== 'production'
// const shell = require("./exec.js").shell
// const MLPERF_IMAGE_NAME = "cr.myelintek.com/mlcommon/mlperf-inference"
const MLPERF_IMAGE = "cr.myelintek.com/mlcommon/mlperf-inference:x86_64"
const CONTAINER_NAME = "mlperf-inference-x86_64"
const MLPERF_SCRATCH_PATH = "/mnt/c/mlcommon"
const MODEL_NAMES = ["SSDMobileNet", "SSDResNet34", "ResNet50", "bert"]
const DATASET_NAMES = ["coco", "imagenet", "squad_tokenized"]
// const CONTAINER_NAME = "mlbenchmarks"

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

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
    let res = execSync('wsl bash -c "service docker status | grep running"');
    let so = res.toString('utf8');
    if (so.includes('running')) {
      mainWindow.webContents.send("docker:pass");
      res = execSync("wsl dockerd --version");
      console.log(res)
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
    execSync("wsl mkdir -p "+MLPERF_SCRATCH_PATH+" "+MLPERF_SCRATCH_PATH+"/data "+MLPERF_SCRATCH_PATH+"/models "+MLPERF_SCRATCH_PATH+"/preprocessed_data");
    execSync("wsl export MLPERF_SCRATCH_PATH="+MLPERF_SCRATCH_PATH);
    // execSync("wsl export DOCKER_IMAGE_NAME="+MLPERF_IMAGE_NAME);
    mainWindow.webContents.send("env:pass");
  } catch (err) {
    let msg = err.output.toString()
    mainWindow.webContents.send("env:fail", msg);
  }
}

function imgPull() {
  try {
    console.log('Hi')
    let pullprocess = exec("wsl sudo docker pull " + MLPERF_IMAGE)
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
    if (so.includes(MLPERF_IMAGE)) {
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
    let res1 = execSync('wsl bash -c "docker exec '+CONTAINER_NAME+' echo \"Hello_world\" " ');
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
    // -e HOST_HOSTNAME="+  hostname+ " "+MLPERF_IMAGE);

    // Need to check if we already have a container running
    let res1 = execSync('wsl bash -c "docker ps" ');
    let so1 = res1.toString('utf8').replace(/\0/g, '');
    // console.log(so1)
    if (so1.includes(CONTAINER_NAME)){
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

function list_configs(){
  try{
    let res1 = execSync('wsl bash -c "docker exec '+ CONTAINER_NAME + ' python print_configs_for_supported_gpu.py"');

    let configs = res1.toString('utf8').replace(/\0/g, '');
    let json_parse = JSON.parse(configs);
    console.log(configs);
    mainWindow.webContents.send("scenario:supported_configs", configs);
    // Split the original string line by line, result is an array of string lines
    // let line_split = configs.split('\n');

    // //Further split every line string, result is a 2d array
    // let msg = []
    // for (let index = 0; index < line_split.length-1; index++) {
    //   let temp = []
    //   let temp_split = line_split[index].split('+');
    //   for (let j = 0; j < temp_split.length; j++){
    //     temp.push(temp_split[j]);
    //   }
    //   msg.push(temp);
    // }
    // // Need to send systems_array and the result of supported gpu or not
    // // console.log(systems_array[0][0])
    // mainWindow.webContents.send("gpu:supported_systems", msg);
  }catch (err){
    let msg = err.output.toString();
    console.log(msg)
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
    // console.log("Target container: "+ CONTAINER_NAME);
    let res1 = execSync('wsl bash -c "docker exec '+ CONTAINER_NAME +' python print_supported_systems.py"');

    let supported_systems = res1.toString('utf8').replace(/\0/g, '');
    // Split the original string line by line, result is an array of string lines
    let line_split = supported_systems.split('\n');

    //Further split every line string, result is a 2d array
    let msg = []
    for (let index = 0; index < line_split.length-1; index++) {
      let temp = []
      let temp_split = line_split[index].split('+');
      for (let j = 0; j < temp_split.length; j++){
        temp.push(temp_split[j]);
      }
      msg.push(temp);
    }
    // Need to send systems_array and the result of supported gpu or not
    // console.log(systems_array[0][0])
    mainWindow.webContents.send("gpu:supported_systems", msg);
    if (supported_systems.includes(gpu_name)){
      let supp_msg = "Current system " + gpu_name + " is supported!"
      // console.log("Current system "+ gpu_name+" is supported!");
      mainWindow.webContents.send("gpu:is_supported", supp_msg);
    } else{
      let supp_msg = "Current system " + gpu_name + " is not supported, need to add manually"
      // console.log("Current system "+ gpu_name+" is not supported, need to add manually");
      mainWindow.webContents.send("gpu:is_supported", supp_msg);
    }
  }catch (err){
    let msg = err.output.toString();
    console.log(msg)
  }
  
}


function check_scratch_path(){
  // Sanity check if scratch path is there
  //command = ' [ -d "/mnt/c/mlcommon/" ] && echo "exists" || echo "not found" '
  let res1 = execSync('wsl bash check_dir_script.sh');
  let msg = res1.toString('utf8').replace(/\0/g, '');
  console.log(msg)
  if (msg.includes("Exists")){
    console.log("Scratch path ready!")
  } else {
    // console.log("Need to setup scratch path first!")
    // ToDo: play around with throwing errors in subfunctions
    throw new Error('Need to setup scratch path first!');
  }
}


function check_folders(path_prefix, directory_names){
  //Check if specific benchmark directories exist
  let readiness = []
  readiness.length = directory_names.length;
  readiness.fill(0);

  for (let i=0; i<directory_names.length; i++){
    let res = execSync('wsl bash check_dir_script.sh ' +path_prefix+'/'+directory_names[i]);
    let msg = res.toString('utf8').replace(/\0/g, '');
    console.log(msg)
    if (msg.includes("Exists")){
      console.log("Benchmark "+directory_names[i]+ " "+ path_prefix+ " folder exists!")
      readiness[i]=1;
    } else {
      console.log("Benchmark "+directory_names[i]+ " "+ path_prefix+ " not ready!")
    }
  }
  console.log(String(readiness));

  return readiness 
}


function check_structure(control_string){
  try {
    let directory_names = "";
    let path_prefix = "";
    if (control_string == "models"){
      directory_names = MODEL_NAMES;
      path_prefix = "models";
    } else if (control_string == "datasets"){
      directory_names = DATASET_NAMES;
      path_prefix = "preprocessed_data";
    } else {
      throw new Error('Unnknown control string');
    }
    //Check directories on page change
    // let model_directory_names = ["SSDMobileNet", "SSDResNet34", "ResNet50", "bert"];
    // let model_directory_names = ["SSDMobileNet"];
    // let data_directory_names = DATASET_NAMES;
    
    check_scratch_path();
    
    let readiness = check_folders(path_prefix, directory_names);

    // ToDo:Send model_readiness result to client
    console.log(control_string+" ready status: "+String(readiness))
  }catch (err){
    // let msg = err.output.toString();
    console.log(err)
  }
}


function ftp_unzip(path_prefix, directory_names,selected_data){
  // Run a script to download given data via nas ftp
  // Run the ftp download script


  // Iterate over selected_data and add model strings where selection is 1
  let archives_to_download=""
  
  for (let i=0; i<selected_data.length; i++){
    if (selected_data[i] == 1) {
      // Compose ftp download string
      archives_to_download = archives_to_download + directory_names[i] + ".zip ";
    }
  }
  //Check if any data need to be downloaded
  if (archives_to_download == ""){
    console.log("No data selected, do nothing")
    return 1;
  }
  // exec does not block the program! Should do the same for other long operations
  let ftpprocess = exec('wsl bash myftpscript.sh '+MLPERF_SCRATCH_PATH+ '/'+path_prefix+'/ /data/mlcommon/'+path_prefix+' '+archives_to_download);
  ftpprocess.stdout.on('data', function (data) {
    console.log(data);
    // mainWindow.webContents.send("docker:pullMsg", data);
    // mainWindow.webContents.send("docker:imgReady");
  })
  // After ftp finishes, try to unzip data files
  ftpprocess.on('exit', (code) => {
    
    console.log(code);
    if (code == 0){
      // Not sure this exit code really indicates ftp download success, most likely just that ftp didn't crash
      // ToDo: Maybe need to check success in some other way
      // console.log("FTP download models finished correctly!");
      console.log("FTP process exited correctly! But did it download your files???(\/)o_o(\/)");
      // After the ftp download process finishes, should unzip files
      //unzip /mnt/c/mlcommon/models/SSDMobileNet.zip -d /mnt/c/mlcommon/models/
      //Unzip all data archives 1 by 1
      // let unzip_command_base = 'unzip '+MLPERF_SCRATCH_PATH+ '/models/'
      let subprocesses = []
      for (let i=0;i<selected_data.length; i++){
        if (selected_data[i] == 1) {
          // Compose unzip command string
          let unzip_command =  "unzip -o "+MLPERF_SCRATCH_PATH+ "/"+path_prefix+"/"+directory_names[i] + ".zip -d "+ MLPERF_SCRATCH_PATH+ '/'+path_prefix+'/"';
          // Can we spawn multiple subprocesses to unzip concurrently?
          // Or do we need to use the same subprocess to launch commands?

          // Try multiple subprocesses
          let unzip_process = exec('wsl bash -c "' + unzip_command);
          subprocesses.push(unzip_process)
          unzip_process.stdout.on('data', function (data) {
            console.log(data);

          });
          unzip_process.on('exit', (code) => {
            subprocesses.pop()
            if (subprocesses.length == 0){
              // Emitt an event that indicates finishing all unzipping
              myEmitter.emit('event', 0);
            }
          })
        }
      }
    }
  });
  return 0;
  // How to catch ftp error? try catch in here?
}



function update_data(control_string, selected_data){
  try{
    // Download models that are selected
    let directory_names ="";
    let path_prefix = "";
    if (control_string == "models"){
      directory_names = MODEL_NAMES;
      path_prefix = "models";
    } else if (control_string == "datasets"){
      directory_names = DATASET_NAMES;
      path_prefix = "preprocessed_data";
    } else {
      throw new Error('Unnknown control string');
    }

    ftp_unzip(path_prefix, directory_names, selected_data);
  
    myEmitter.on('event', function(code) {
      if (code == 0){
        let readiness = check_folders(path_prefix, directory_names);
        console.log(control_string+" ready status: "+String(readiness))
        //Send model status to client
      }
    })
    
    
  } catch(err){
    // let msg = err.output.toString();
    console.log(err)
  }
  
}


ipcMain.on('wsl:check', () => {
  console.log("wsl:check");
  // check_structure("data");
  // update_data("datasets", [0,0,1]);
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
})

ipcMain.on('gpu:check', () => {
  list_supported_systems();
})

ipcMain.on('scenario:check', () => {
  list_configs();
})

ipcMain.on('download:models', (e, args) => {
  console.log(args);
})

ipcMain.on('download:datasets', (e, args) => {
  console.log(args);
})