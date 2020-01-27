let rawData;
let data;
let rez;
let rezSlider;
let countP;
let currentColor;
let labelSelect;

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

let moreButton;
let menu = document.getElementById('moreMenu');

function openMore() {
  menu.style.width = '250px';
}

function closeMore() {
  menu.style.width = '0px';
}


function setup() {
  frameRate(3);
  let canvas = createCanvas(600, 600);
  canvas.position(100, 10);
  countP = createP('Database size: ');
  countP.position(width + 115, 15);
  //rezSlider = createSlider(1, width / 2, 10, 10);
  labelSelect = createSelect();
  labelSelect.option('All');
  for (let color of colorList) {
    labelSelect.option(color);
  }
  labelSelect.style('height', '20px');
  labelSelect.style('width', '100px');
  labelSelect.position(width + 115, 65);

  moreButton = createImg('more.png', 'error loading image');
  moreButton.position(30, 30);
  moreButton.class('moreButton');
  moreButton.mousePressed(openMore);
}

function gotData(data) {
  //print(data.val());
  rawData = data.val();
  //print('got data!');
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    let x = floor(mouseX / rez);
    let y = floor(mouseY / rez);
    let index = x + y * floor(width / rez);
    let shownData = [];
    let shownKeys = [];
    if (currentColor == 'All') {
      for (let key in rawData) {
        shownData.push(rawData[key]);
        shownKeys.push(key);
      }
    } else {
      for (let key in rawData) {
        if (rawData[key].label == currentColor) {
          shownData.push(rawData[key]);
          shownKeys.push(key);
        }
      }
    }
    print(`Key: ${shownKeys[index]}`);
    print(shownData[index]);
  }
}

function draw() {
  //rez = rezSlider.value();
  rez = 10;
  currentColor = labelSelect.value();
  database.ref('colors').once('value', gotData);
  background(51);
  if (rawData) {
    let x = 0;
    let y = 0;

    let count = 0;
    for (let key in rawData) {
      if (currentColor == 'All') {
        let r = rawData[key].r;
        let g = rawData[key].g;
        let b = rawData[key].b;
        let c = color(r, g, b);
        fill(c);
        noStroke();
        rect(x, y, rez, rez);

        x += rez;

        if (x > width - rez) {
          x = 0;
          y += rez;
        }
        count++;
      } else if (rawData[key].label == currentColor) { // && rawData[key].uid != 'JG5NR5dcVSSnVNvrZU9clFuzHel1'
        let r = rawData[key].r;
        let g = rawData[key].g;
        let b = rawData[key].b;
        let c = color(r, g, b);
        fill(c);
        noStroke();
        rect(x, y, rez, rez);

        x += rez;

        //if (x >= width - rez) {
        if (x > width - rez) {
          x = 0;
          y += rez;
        }
        count++;
      }
    }
    countP.html(`Database size : ${count}`);
  }
}
