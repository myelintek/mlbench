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

window.onload = function () {
  ipcRenderer.send('wsl:check');
}