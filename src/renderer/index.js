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

ipcRenderer.on("ub:pass", () => {
  document.getElementById("ubStatus").innerHTML = "Pass";
})

ipcRenderer.on("ub:fail", () => {
  document.getElementById("ubStatus").innerHTML = "Fail";
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

ipcRenderer.on("nv:pass", () => {
  document.getElementById("nvStatus").innerHTML = "Pass"
})

ipcRenderer.on("nv:fail", () => {
  document.getElementById("nvStatus").innerHTML = "Fail"
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
  document.getElementById("gpuStatus").innerHTML = supp_msg;
})

document.getElementById('scenarioCheck').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('scenario:check');
});

ipcRenderer.on("scenario:supported_configs", (event, msg) => {
  for (var i = 0; i < msg.length; i++) {
    var tempPre = document.getElementById(msg[i]["benchmark"]);
    tempPre.innerHTML = JSON.stringify(msg[i]).replace(/,/g, "\n");
  }
})

document.getElementById('extend1').addEventListener('click', (event) => {
  var x = document.getElementById("ResNet50");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa1').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa1').classList.toggle("fa-plus");
  }
});

document.getElementById('extend2').addEventListener('click', (event) => {
  var x = document.getElementById("SSDResNet34");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa2').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa2').classList.toggle("fa-plus");
  }
});

document.getElementById('extend3').addEventListener('click', (event) => {
  var x = document.getElementById("SSDMobileNet");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa3').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa3').classList.toggle("fa-plus");
  }
});

document.getElementById('extend4').addEventListener('click', (event) => {
  var x = document.getElementById("BERT");
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

document.getElementById('checkResults').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('results:check');
});

ipcRenderer.on("results:data_output", (event, msg) => {
  var ctx = document.getElementById('chart'); //.getContext('2d');
  var inp_labels = [
    'DGX-A100_A100-SXM 4x1', 
    'NVIDIA A10x1', 
    'NVIDIA T4x1'
  ];

  var inp_background_color = [
    'rgb(255, 99, 132)',
    'rgb(255, 99, 132)',
    'rgb(255, 99, 132)'
  ];

  var inp_border_color = [
    'rgb(255, 99, 132)',
    'rgb(255, 99, 132)',
    'rgb(255, 99, 132)'
  ];

  // var inp_data = [37479.50, 13805.20, 6035.57];
  var inp_data = [47779.20, 18529.20, 7399.41];

  for (var key in msg['ssd-mobilenet']) {
    inp_labels.push(msg['ssd-mobilenet'][key]["gpu"]);
    inp_background_color.push('rgb(54, 162, 235)');
    inp_border_color.push('rgb(54, 162, 235)');
    inp_data.push(msg['ssd-mobilenet'][key]["result"])
  }

  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: inp_labels,
      datasets: [{
        backgroundColor: inp_background_color,
        borderColor: inp_border_color,
        data: inp_data
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'ObjectDetection, COCO, SSD-MobileNet, Offline',
          font: {
              size: 24
          },
          align: 'start'
        }    
      },
      indexAxis: 'y',
    }
  })

  ctx.style.display = "block";

})

document.getElementById('runBenchmark').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('benchmark:run');  
});

var stepperElem = document.querySelector('.bs-stepper');
stepperElem.addEventListener('shown.bs-stepper', function (e) {
  var idx = e.detail.indexStep + 1;
  console.log('step shown', idx)
})