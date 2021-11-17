// // npm install --save electron-tabs
const { ipcRenderer } = require('electron');
const Stepper = require('bs-stepper');
const Chart = require('chart.js');

var stepper1 = new Stepper(document.querySelector('#stepper1'))

document.getElementById('nextButton').addEventListener('click', (event) => {
    stepper1.next();
});

document.getElementById('prevButton').addEventListener('click', (event) => {
    stepper1.previous();
});

document.getElementById('nextButton1').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton1').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton2').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton2').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton3').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton3').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton4').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton4').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton5').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton5').addEventListener('click', (event) => {
  stepper1.previous();
});

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

ipcRenderer.on("wsl:note", (event, msg) => {
  document.getElementById("wslNote").innerHTML = msg;
});

ipcRenderer.on("ub:pass", () => {
  document.getElementById("ubStatus").innerHTML = "Pass";
})

ipcRenderer.on("ub:fail", () => {
  document.getElementById("ubStatus").innerHTML = "Fail";
})

ipcRenderer.on("ub:note", (event, msg) => {
  console.log(msg);
  document.getElementById("ubNote").innerHTML = msg;
})

ipcRenderer.on("sudo:pass", () => {
  document.getElementById("sudonpStatus").innerHTML = "Pass";
})

ipcRenderer.on("sudo:fail", () => {
  document.getElementById("sudonpStatus").innerHTML = "Fail";
})

ipcRenderer.on("docker:pass", () => {
  document.getElementById("dockerStatus").innerHTML = "Pass";
})

ipcRenderer.on("docker:fail", () => {
  document.getElementById("dockerStatus").innerHTML = "Fail";
})

// ipcRenderer.on("docker:note", (event, msg) => {
//   console.log(msg);
//   document.getElementById("dockerNote").innerHTML = msg;
// })

ipcRenderer.on("nv:pass", () => {
  document.getElementById("nvStatus").innerHTML = "Pass"
})

ipcRenderer.on("nv:fail", () => {
  document.getElementById("nvStatus").innerHTML = "Fail"
})

// ipcRenderer.on("nv:status", (event, msg) => {
//   document.getElementById("nvNote").innerHTML = msg;
// })

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
  document.getElementById("imgPullConsole").innerHTML += "</br>"+msg;
})

ipcRenderer.on("docker:imgReady", () => {
  document.getElementById("imgPullStatus").innerHTML = "Ready";
})

ipcRenderer.on("docker:run_pass", () => {
  document.getElementById("imgRunStatus").innerHTML = "Ready";
})

ipcRenderer.on("docker:run_fail", () => {
  document.getElementById("imgRunStatus").innerHTML = "Failed";
})

var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [
      'DGX-A100_A100-SXM 4x1', 
      'NVIDIA A10x1', 
      'NVIDIA T4x1', 
      'NVIDIA GeForce RTX 3080x1 (NativePy)',
      'NVIDIA GeForce RTX 3080x1 (TensorRT)' 
    ],
    datasets: [{
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 99, 132)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(54, 162, 235)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 99, 132)',
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(54, 162, 235)'
      ],
      data: [37479.50, 13805.20, 6035.57, 755.83, 15053.60]
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'ImageClassify, ImageNet, ResNet50, Offline',
        font: {
            size: 24
        },
        align: 'start'
      }    
    },
    indexAxis: 'y',
  }
})