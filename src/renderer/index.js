// // npm install --save electron-tabs
const { ipcRenderer } = require('electron');
const Stepper = require('bs-stepper');
const Chart = require('chart.js');
import "./css/bs-stepper.css"
import "./js/bs-stepper.js"

var stepper1 = new Stepper(document.querySelector('#stepper1'), {
  linear: false
})


// document.on('click', 'a[href^="http"]', function(event) {
//   event.preventDefault();
//   ipcRenderer.openExternal(this.href);
// });

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

ipcRenderer.on("wsl:full_status", (event, flag) => {
  if (flag == true){
    document.getElementById('setup-lunch-environment-trigger').disabled = false;
    document.getElementById('nextButton').disabled = false;
  }
})

ipcRenderer.on("env:pass", () => {
  document.getElementById("wslEnvStatus").innerHTML = "Ready"
  document.getElementById('imgPull').disabled = false;
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
  document.getElementById('imgRun').disabled = false;

})

ipcRenderer.on("docker:run_pass", () => {
  document.getElementById("imgRunStatus").innerHTML = "Ready";
  document.getElementById('check-gpu-trigger').disabled = false;
  document.getElementById('check-scenario-trigger').disabled = false;
  document.getElementById('download-trigger').disabled = false;
  document.getElementById('run-benchmark-trigger').disabled = false;
  document.getElementById('nextButton1').disabled = false;
})

ipcRenderer.on("docker:run_fail", () => {
  document.getElementById("imgRunStatus").innerHTML = "Failed";
})

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
  var tbl = document.getElementById("gpuTable");
  tbl.innerHTML = "";
  tbl.append(tblBody);
})

ipcRenderer.on("gpu:is_supported", (event, supp_msg) => {
  document.getElementById("gpuStatus").innerHTML = supp_msg;
})

document.getElementById('gpuCheckBtn').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('gpu:check');
});

ipcRenderer.on("scenario:supported_configs", (event, msg) => {
  console.log(msg);
  for (var i = 0; i < msg.length; i++) {
    document.getElementById('extend' + msg[i]["benchmark"]).hidden = false;
    document.getElementById('scenario' + msg[i]["benchmark"] + 'Config').innerHTML = msg[i]["scenario"];
    document.getElementById('class' + msg[i]["benchmark"] + 'Config').innerHTML = msg[i]["system"];    
    var tempPre = document.getElementById(msg[i]["benchmark"]);
    tempPre.innerHTML = JSON.stringify(msg[i]).replace(/,/g, "\n");
  }
})

document.getElementById('extendResNet50').addEventListener('click', (event) => {
  var x = document.getElementById("ResNet50");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa1').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa1').classList.toggle("fa-plus");
  }
});

document.getElementById('extendSSDResNet34').addEventListener('click', (event) => {
  var x = document.getElementById("SSDResNet34");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa2').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa2').classList.toggle("fa-plus");
  }
});

document.getElementById('extendSSDMobileNet').addEventListener('click', (event) => {
  var x = document.getElementById("SSDMobileNet");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa3').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa3').classList.toggle("fa-plus");
  }
});

document.getElementById('extendBERT').addEventListener('click', (event) => {
  var x = document.getElementById("BERT");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById('fa4').classList.toggle("fa-minus");
  } else {
    x.style.display = "none";
    document.getElementById('fa4').classList.toggle("fa-plus");
  }
});

document.getElementById('scenarioCheckBtn').addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('scenario:check');
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

ipcRenderer.on("download:models_status", (event, msg) => {
  if (msg[0] == 1){
    document.getElementById("mobilenetStatus").innerHTML = "Ready"; 
  }
  if (msg[1] == 1){
    document.getElementById("resnet34Status").innerHTML = "Ready"; 
  }
  if (msg[2] == 1){
    document.getElementById("resnet50Status").innerHTML = "Ready"; 
  }
  if (msg[3] == 1){
    document.getElementById("bertStatus").innerHTML = "Ready"; 
  }
})

ipcRenderer.on("download:datasets_status", (event, msg) => {
  if (msg[0] == 1){
    document.getElementById("cocoStatus").innerHTML = "Ready"; 
  }
  if (msg[1] == 1){
    document.getElementById("imagenetStatus").innerHTML = "Ready"; 
  }
  if (msg[2] == 1){
    document.getElementById("squadStatus").innerHTML = "Ready"; 
  }
})

ipcRenderer.on("download:models_msg", (event, msg) => {
  document.getElementById("downloadModelsConsole").innerHTML += "</br>" + msg;
})

ipcRenderer.on("download:dataset_msg", (event, msg) => {
  document.getElementById("downloadDatasetsConsole").innerHTML += "</br>" + msg;
})

ipcRenderer.on("benchmark:status", (event, msg) => {
  for (const entry in msg) {
    if (entry == "ssd-mobilenet"){
      if (msg[entry]["model"] == 1){
        document.getElementById("modelMobilenetStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["dataset"] == 1){
        document.getElementById("datasetMobilenetStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["config"] == 1){
        document.getElementById("scenarioMobilenetStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["status"] == 1){
        document.getElementById("statusMobilenetStatus").innerHTML = "Ready"; 
        document.getElementById("mobilenetBenchmarkCheck").disabled = false;
        document.getElementById('runBenchmark').disabled = false;
      }
    }
    if (entry == "ssd-resnet34"){
      if (msg[entry]["model"] == 1){
        document.getElementById("modelResnet34Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["dataset"] == 1){
        document.getElementById("datasetResnet34Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["config"] == 1){
        document.getElementById("scenarioResnet34Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["status"] == 1){
        document.getElementById("statusResnet34Status").innerHTML = "Ready";
        document.getElementById("resnet34BenchmarkCheck").disabled = false;
        document.getElementById('runBenchmark').disabled = false;
      }
    }
    if (entry == "resnet50"){
      if (msg[entry]["model"] == 1){
        document.getElementById("modelResnet50Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["dataset"] == 1){
        document.getElementById("datasetResnet50Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["config"] == 1){
        document.getElementById("scenarioResnet50Status").innerHTML = "Ready"; 
      }
      if (msg[entry]["status"] == 1){
        document.getElementById("statusResnet50Status").innerHTML = "Ready";
        document.getElementById("resnet50BenchmarkCheck").disabled = false;
        document.getElementById('runBenchmark').disabled = false;
      }
    }
    if (entry == "bert"){
      if (msg[entry]["model"] == 1){
        document.getElementById("modelBertStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["dataset"] == 1){
        document.getElementById("datasetBertStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["config"] == 1){
        document.getElementById("scenarioBertStatus").innerHTML = "Ready"; 
      }
      if (msg[entry]["status"] == 1){
        document.getElementById("statusBertStatus").innerHTML = "Ready"; 
        document.getElementById("bertBenchmarkCheck").disabled = false;
        document.getElementById('runBenchmark').disabled = false;
      }
    }
  }
})

document.getElementById('runBenchmark').addEventListener('click', (event) => {
  event.preventDefault();
  const benchmarks = [0, 0, 0, 0]
  // Get the checkbox
  var resnet50CheckBox = document.getElementById("resnet50BenchmarkCheck");
  // If the checkbox is checked, display the output text
  if (resnet50CheckBox.checked == true){
    benchmarks[2] = 1
  }

  // Get the checkbox
  var resnet34CheckBox = document.getElementById("resnet34BenchmarkCheck");
  // If the checkbox is checked, display the output text
  if (resnet34CheckBox.checked == true){
    benchmarks[1] = 1
  }
  
  // Get the checkbox
  var mobilenetCheckBox = document.getElementById("mobilenetBenchmarkCheck");
  // If the checkbox is checked, display the output text
  if (mobilenetCheckBox.checked == true){
    benchmarks[0] = 1
  }

  // Get the checkbox
  var bertCheckBox = document.getElementById("bertBenchmarkCheck");
  // If the checkbox is checked, display the output text
  if (bertCheckBox.checked == true){
    benchmarks[3] = 1
  }
  ipcRenderer.send('benchmark:run', benchmarks);  
});

ipcRenderer.on("benchmark:run_status", (event, msg) => {
  document.getElementById("benchmarkRunStatus").innerHTML = msg;
  if (msg == "Building..."){
    document.getElementById('runBenchmark').disabled = true;
  } else if (msg == "Running..."){
    document.getElementById('runBenchmark').disabled = true;
  } else {
    document.getElementById('runBenchmark').disabled = false;
  }

  if (msg == "Running Finished!"){
    document.getElementById('results-trigger').disabled = false;
    document.getElementById('nextButton5').disabled = false;
  }
})

ipcRenderer.on("benchmark:msg", (event, msg) => {
  document.getElementById("runBenchmarksConsole").innerHTML += "</br>" + msg;
})

ipcRenderer.on("results:data_output", (event, msg) => {
  

  var charts = []

  // var inp_data = [37479.50, 13805.20, 6035.57];
  //SSD-Mobilenet
  //Resnet
  //SSD-Resnet34
  //BERT
  let inp_data = [[47779.20, 18529.20, 7399.41],
                  [37479.50, 13805.20, 6035.57],
                  [913.21, 316.49, 134.51],
                  [3236.94, 1111.46, 375.89]
                ];
  let chart_description = ['Object Detection, COCO, SSD-MobileNet, Offline', 
                            'Image Recognition, Imagenet, ResNet50, Offline',
                            'Object Detection, COCO, SSD-ResNet34, Offline',
                            'NLP, Squadv1.1, BERT, Offline'];

  let msg_keys = Object.keys(msg);
  let ctx;
  let inp_labels;
  let inp_background_color;
  let inp_border_color;
  for (let i = 0; i<msg_keys.length; i++ ) {
    var chartStatus = Chart.getChart("chart"+String(i)); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    ctx = document.getElementById('chart'+String(i)); //.getContext('2d');
    inp_labels = [
      'DGX-A100_A100-SXM 4x1', 
      'NVIDIA A10x1', 
      'NVIDIA T4x1'
    ];

    inp_background_color = [
      'rgb(255, 99, 132)',
      'rgb(255, 99, 132)',
      'rgb(255, 99, 132)'
    ];

    inp_border_color = [
      'rgb(255, 99, 132)',
      'rgb(255, 99, 132)',
      'rgb(255, 99, 132)'
    ];
    let benchmark = msg_keys[i];
    for (var key in msg[benchmark]){
      // inp_labels.push(msg[benchmark][key]["gpu"]);
      let gpu_params = msg[benchmark][key]["gpu"].split('_');
      inp_labels.push(key+" "+gpu_params[0]);
      inp_background_color.push('rgb(54, 162, 235)');
      inp_border_color.push('rgb(54, 162, 235)');
      inp_data[i].push(msg[benchmark][key]["result"])
    }
    

    let chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: inp_labels,
        datasets: [{
          backgroundColor: inp_background_color,
          borderColor: inp_border_color,
          data: inp_data[i]
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: chart_description[i],
            font: {
                size: 24
            },
            align: 'start'
          }    
        },
        indexAxis: 'y',
      }
    })
    charts.push(chart);
    ctx.style.display = "block";
  }

  

  // TODO: Remove this hardcode
  // for (var key in msg['ssd-mobilenet']) {
  //   inp_labels.push(msg['ssd-mobilenet'][key]["gpu"]);
  //   inp_background_color.push('rgb(54, 162, 235)');
  //   inp_border_color.push('rgb(54, 162, 235)');
  //   inp_data.push(msg['ssd-mobilenet'][key]["result"])


  // }

  // var chart = new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: inp_labels,
  //     datasets: [{
  //       backgroundColor: inp_background_color,
  //       borderColor: inp_border_color,
  //       data: inp_data
  //     }]
  //   },
  //   options: {
  //     plugins: {
  //       legend: {
  //         display: false
  //       },
  //       title: {
  //         display: true,
  //         text: 'ObjectDetection, COCO, SSD-MobileNet, Offline',
  //         font: {
  //             size: 24
  //         },
  //         align: 'start'
  //       }    
  //     },
  //     indexAxis: 'y',
  //   }
  // })

  

})

var stepperElem = document.querySelector('.bs-stepper');
stepperElem.addEventListener('shown.bs-stepper', function (e) {
  var idx = e.detail.indexStep + 1;
  if (idx == 3){
    ipcRenderer.send('gpu:check');
  }
  if (idx == 4){
    ipcRenderer.send('scenario:check');
  }
  if (idx == 5){
    ipcRenderer.send('download:check');

    var resnet50CheckBox = document.getElementById("resnet50Check");
    if (resnet50CheckBox.checked == true){
      resnet50CheckBox.checked = false;
    }
    var resnet34CheckBox = document.getElementById("resnet34Check");
    if (resnet34CheckBox.checked == true){
      resnet34CheckBox.checked = false;
    }
    var mobilenetCheckBox = document.getElementById("mobilenetCheck");
    if (mobilenetCheckBox.checked == true){
      mobilenetCheckBox.checked = false;
    }
    var bertCheckBox = document.getElementById("bertCheck");
    if (bertCheckBox.checked == true){
      bertCheckBox.checked = false;
    }

    var cocoCheckBox = document.getElementById("cocoCheck");
    if (cocoCheckBox.checked == true){
      cocoCheckBox.checked = false;
    }
  
    var imageNetCheckBox = document.getElementById("imageNetCheck");
    if (imageNetCheckBox.checked == true){
      imageNetCheckBox.checked = false;
    }
    
    var squadCheckBox = document.getElementById("squadCheck");
    if (squadCheckBox.checked == true){
      squadCheckBox.checked = false;
    }

  }
  if (idx == 6){
    ipcRenderer.send('benchmark:check');
  }
  if (idx == 7){
    ipcRenderer.send('results:check');
  }
  console.log('step shown', idx)
})