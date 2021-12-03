// // npm install --save electron-tabs
const { ipcRenderer } = require('electron');
const Stepper = require('bs-stepper');
const Chart = require('chart.js');

var stepper1 = new Stepper(document.querySelector('#stepper1'), {
  linear: false
})

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

// next Download
document.getElementById('nextButton3').addEventListener('click', (event) => {
  stepper1.next();
  // ipcRenderer.send('download:check');
});

document.getElementById('prevButton3').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton4').addEventListener('click', (event) => {
  stepper1.next();
});

// prev Download
document.getElementById('prevButton4').addEventListener('click', (event) => {
  stepper1.previous();
});

document.getElementById('nextButton5').addEventListener('click', (event) => {
  stepper1.next();
});

document.getElementById('prevButton5').addEventListener('click', (event) => {
  stepper1.previous();
});

// Button "Check"
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

// ipcRenderer.on("wsl:note", (event, msg) => {
//   document.getElementById("wslNote").innerHTML = msg;
// });

ipcRenderer.on("ub:pass", () => {
  document.getElementById("ubStatus").innerHTML = "Pass";
})

ipcRenderer.on("ub:fail", () => {
  document.getElementById("ubStatus").innerHTML = "Fail";
})

// ipcRenderer.on("ub:note", (event, msg) => {
//   console.log(msg);
//   document.getElementById("ubNote").innerHTML = msg;
// })

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

document.getElementById('gpuCheck').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('gpu:check');
});

ipcRenderer.on("gpu:supported_systems", (event, msg) => {
  // console.log(msg);
  var tblBody = document.createElement("tbody");
  for (var i = 0; i < msg.length; i++) {
    var row = document.createElement("tr");
    for (var j = 0; j < msg[i].length; j++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(msg[i][j]);
      cell.appendChild(cellText);
      row.appendChild(cell);            
    }
    tblBody.appendChild(row);
}
document.getElementById("gpuTable").append(tblBody)
})

ipcRenderer.on("gpu:is_supported", (event, supp_msg) => {
  // console.log(supp_msg);
  document.getElementById("gpuStatus").innerHTML = supp_msg;
})

document.getElementById('scenarioCheck').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('scenario:check');
});

ipcRenderer.on("scenario:supported_configs", (event, msg) => {
  console.log(msg);
})

document.getElementById('extend1').addEventListener('click', (event) => {
  var x = document.getElementById("scenario1");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa1').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa1').classList.toggle("fa-plus");
  }
});

document.getElementById('extend2').addEventListener('click', (event) => {
  var x = document.getElementById("scenario2");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa2').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa2').classList.toggle("fa-plus");
  }
});

document.getElementById('extend3').addEventListener('click', (event) => {
  var x = document.getElementById("scenario3");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa3').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa3').classList.toggle("fa-plus");
  }
});

document.getElementById('extend4').addEventListener('click', (event) => {
  var x = document.getElementById("scenario4");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa4').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa4').classList.toggle("fa-plus");
  }
});

document.getElementById('downloadModels').addEventListener('click', (event) => {
  event.preventDefault();
  const models = [0, 0, 0, 0]
  // Get the checkbox
  var resnet50CheckBox = document.getElementById("resnet50Check");
  // If the checkbox is checked, display the output text
  if (resnet50CheckBox.checked == true){
    models[2] = 1
  }

  // Get the checkbox
  var resnet34CheckBox = document.getElementById("resnet34Check");
  // If the checkbox is checked, display the output text
  if (resnet34CheckBox.checked == true){
    models[1] = 1
  }
  
  // Get the checkbox
  var mobilenetCheckBox = document.getElementById("mobilenetCheck");
  // If the checkbox is checked, display the output text
  if (mobilenetCheckBox.checked == true){
    models[0] = 1
  }

  // Get the checkbox
  var bertCheckBox = document.getElementById("bertCheck");
  // If the checkbox is checked, display the output text
  if (bertCheckBox.checked == true){
    models[3] = 1
  }

  ipcRenderer.send('download:models', models);
  
});

document.getElementById('downloadDatasets').addEventListener('click', (event) => {
  event.preventDefault();
  const datasets = [0, 0, 0]
  // Get the checkbox
  var cocoCheckBox = document.getElementById("cocoCheck");
  // If the checkbox is checked, display the output text
  if (cocoCheckBox.checked == true){
    datasets[0] = 1
  }

  // Get the checkbox
  var imageNetCheckBox = document.getElementById("imageNetCheck");
  // If the checkbox is checked, display the output text
  if (imageNetCheckBox.checked == true){
    datasets[1] = 1
  }
  
  // Get the checkbox
  var squadCheckBox = document.getElementById("squadCheck");
  // If the checkbox is checked, display the output text
  if (squadCheckBox.checked == true){
    datasets[2] = 1
  }

  ipcRenderer.send('download:datasets', datasets);
  
});

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