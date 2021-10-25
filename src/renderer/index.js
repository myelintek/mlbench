const { ipcRenderer } = require('electron');

document.getElementById('wslCheckBtn').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('wsl:check');
});

ipcRenderer.on("wsl:pass", () => {
  document.getElementById("wslStatus").innerHTML = "Pass";
})

ipcRenderer.on("wsl:fail", () => {
  document.getElementById("wslStatus").innerHTML = "Fail";
})

ipcRenderer.on("ub:pass", () => {
  document.getElementById("ubStatus").innerHTML = "Pass";
})

ipcRenderer.on("ub:fail", () => {
  document.getElementById("ubStatus").innerHTML = "Fail";
})

ipcRenderer.on("docker:pass", () => {
  document.getElementById("dockerStatus").innerHTML = "Pass";
})

ipcRenderer.on("docker:fail", () => {
  document.getElementById("dockerStatus").innerHTML = "Fail";
})

ipcRenderer.on("docker:note", (event, msg) => {
  console.log(msg);
  document.getElementById("dockerNote").innerHTML = msg;
})

ipcRenderer.on("env:pass", () => {
  document.getElementById("wslEnvStatus").innerHTML = "Ready"
})

ipcRenderer.on("env:fail", (event, msg) => {
  document.getElementById("wslEnvStatus").innerHTML = msg
})

window.onload = function () {
  ipcRenderer.send('wsl:check');
}

document.getElementById('wslEnvSetup').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('wsl:envSetup');
});

document.getElementById('imgPull').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('docker:pull');
});

document.getElementById('imgRun').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('docker:run');
});

ipcRenderer.on("docker:pullMsg", (event, msg) => {
  document.getElementById("imgPullConsole").innerHTML = msg;
})

ipcRenderer.on("docker:imgReady", () => {
  document.getElementById("mlgPullStatus").innerHTML = "Ready";
})