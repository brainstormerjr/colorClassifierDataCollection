
let rawData, xs, ys; //variables to hold the data
let dataCollected = false;
let currentBatch = 0;
let totalBatches;
let currentEpoch = 0;
let totalEpochs = 10;
let batchPerEpoch;
let prediction;

let menu = document.getElementById('moreMenu');

//shortcuts to get colors
let colorList = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
  'Brown'
];

//setup and initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfFeyVZhm-djmgz4fCRXS1RgFRVf99mZY",
  authDomain: "color-classification-e92cd.firebaseapp.com",
  databaseURL: "https://color-classification-e92cd.firebaseio.com",
  projectId: "color-classification-e92cd",
  storageBucket: "color-classification-e92cd.appspot.com",
  messagingSenderId: "95381377312",
  appId: "1:95381377312:web:07003c3e2b2cb35dbbc745"
};
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

p5.disableFriendlyErrors = true;

//create model
let model = tf.sequential();

//add a hidden layer
model.add(tf.layers.dense({
  units: 12,
  inputShape: [3],
  activation: 'sigmoid'
}));

model.add(tf.layers.dense({
  units: 12,
  activation: 'sigmoid'
}));

//add an output layer
model.add(tf.layers.dense({
  units: 8,
  activation: 'softmax'
}));

model.compile({
  optimizer: tf.train.sgd(0.2),
  loss: 'categoricalCrossentropy'
});

async function setupData() {
  //get the raw data as an object
  await database.ref('colors').once('value', (data) => {
    rawData = data.val();
    console.log('Got raw data');
  });

  //store all data into an array
  let dataPoints = 0;
  let data = [];
  for (let key in rawData) {
    data.push(rawData[key]);
    dataPoints++;
  }

  batchPerEpoch = floor(dataPoints / 32 + 1);
  totalBatches = batchPerEpoch * totalEpochs;

  //extract xs
  let xs_arr = [];
  for (let p of data) {
    let r = p.r;
    let g = p.g;
    let b = p.b;
    xs_arr.push([r, g, b]);
  }
  xs = tf.tensor2d(xs_arr);

  //extract ys
  let ys_arr = [];
  for (let p of data) {
    ys_arr.push(colorList.indexOf(p.label));
  }
  let labelsTensor = tf.tensor1d(ys_arr, 'int32'); //
  ys = tf.oneHot(labelsTensor, 8);

  console.log('Finished tidying data');
  dataCollected = true;
  trainButton.html('TRAIN');
  document.getElementsByClassName('trainButton')[0].disabled = false;

  // xs.print();
  // ys.print();
}

function train() {
  trainButton.style('display', 'none');

  model.fit(xs, ys, {
    shuffle: true,
    epochs: totalEpochs,
    callbacks: {
      onTrainBegin: console.log('Fitting start'),
      onEpochEnd: () => {
        currentEpoch++;
      },
      onBatchEnd: (batch, logs) => {
        // print(`completed ${batch + 1} epochs`);
        // print(logs);
        currentBatch = (batch + 1) + currentEpoch * batchPerEpoch;
        print(currentEpoch);
      }
    }
  }).then(() => {
    console.log('Fitting completed');
  })
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  setupDom(); //setup all dom elements

  //setup data for training
  setupData();
}

function draw() {
  //update the canvas
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  setGradient(r, g, b);
  setColor(r, g, b);
  drawLoadingBar(currentBatch, totalBatches);

  let inputs = tf.tensor2d([
    [r/255, g/255, b/255]
  ]);
  let results = model.predict(inputs);
  let index = results.argMax(1).dataSync();

  let label = colorList[index];
  prediction = label;
}
