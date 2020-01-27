let currentColor;
let buttons = [];
let infoButton;
let alertButton;
let moreButton;
let colorDiv;
let blacklisted = false;

//setup and initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfFeyVZhm-djmgz4fCRXS1RgFRVf99mZY",
  authDomain: "color-classification-e92cd.firebaseapp.com",
  databaseURL: "https://color-classification-e92cd.firebaseio.com",
  projectId: "color-classification-e92cd",
  storageBucket: "color-classification-e92cd.appspot.com",
  messagingSenderId: "95381377312",
  appId: "1:95381377312:web:07003c3e2b2cb35dbbc745",
  measurementId: "G-VDR0QJ61YE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();
let authPromise = firebase.auth().signInAnonymously();

let blacklist = ['JG5NR5dcVSSnVNvrZU9clFuzHel1', 'XgFU4YOxgmPcPa9DpSOc6mixmKX2'];
//let blacklist = ['JG5NR5dcVSSnVNvrZU9clFuzHel1'];

let modal = document.getElementById('modal');
let blacklistModal = document.getElementById('blacklistModal');
let menu = document.getElementById('moreMenu');
let modalCloseButton = document.getElementsByClassName('close')[0];
let blacklistCloseButton = document.getElementsByClassName('close')[1];

function pickNewColor() {
  //random colors
  let r = floor(random(256));
  let g = floor(random(256));
  let b = floor(random(256));

  //set background as gradient
  setGradient(r, g, b);

  //set current color display
  currentColor = color(r, g, b, 255);
  rectMode(CENTER);
  fill(currentColor);
  stroke(0);
  strokeWeight(5);
  rect(width / 2, height / 4, 300, 300, 20);

  //update the div
  colorDiv.html(`R: ${r} G: ${g} B: ${b}`);
}

function setGradient(r, g, b) {
  background(255);
  let top = color(r, g, b, 150);
  let bottom = color(r, g, b, 50);
  let step = 3;
  for (let y = 0; y < height; y += step) {
    let sectionColor = lerpColor(top, bottom, y / height);
    rectMode(CORNER);
    noStroke();
    fill(sectionColor);
    rect(0, y, width, step);
  }
}

async function buttonPressed() {
  //print(this.html());
  let {user} = await authPromise;
  let colorDatabase = database.ref('colors');
  let r = red(currentColor);
  let g = green(currentColor);
  let b = blue(currentColor);
  if (!blacklisted) {

    var data = {
      uid: user.uid,
      r: r,
      g: g,
      b: b,
      label: this.html()
    };

    console.log('Saving Data...');
    console.log(data);

    let color = colorDatabase.push(data, finished);
    console.log(`Firebase generated key: ${color.key}`);

    pickNewColor();
  } else {
    openBlacklistModal();
  }

  function finished(err) {
    if (err) {
      console.error('oops, something went wrong');
      console.log(err);
    } else {
      console.log('Data saved successfully!');
    }
  }

}

function openInfo() {
  //print('opening info');
  modal.style.display = 'block';
}

function openBlacklistModal() {
  blacklistModal.style.display = 'block';
}

function openMore() {
  menu.style.width = '250px';
}

function closeMore() {
  menu.style.width = '0px';
}

modalCloseButton.onclick = function () {
  modal.style.display = 'none';
};

blacklistCloseButton.onclick = function () {
  blacklistModal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  } else if (event.target == blacklistModal) {
    blacklistModal.style.display = "none";
  }
};

async function checkBlackList() {
  for (let uid of blacklist) {
    let {user} = await authPromise;
    if (user.uid == uid) {
      blacklisted = true;
      console.log('YOU ARE BLACKLISTED');
      alertButton = createImg('alert.png', 'error loading image');
      alertButton.position(80, 30);
      alertButton.class('alertButton');
      alertButton.mousePressed(openBlacklistModal);
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  checkBlackList();


  //setup div for color text display
  colorDiv = createDiv();
  colorDiv.class('colorDiv');
  colorDiv.position(0, height / 2);

  //setup dom buttons
  buttons.push(createButton('Red'));
  buttons[0].position(width / 2 - 150, height / 2 + 50);
  buttons.push(createButton('Blue'));
  buttons[1].position(width / 2 + 25, height / 2 + 50);
  buttons.push(createButton('Green'));
  buttons[2].position(width / 2 - 150, height / 2 + 130);
  buttons.push(createButton('Yellow'));
  buttons[3].position(width / 2 + 25, height / 2 + 130);
  buttons.push(createButton('Pink'));
  buttons[4].position(width / 2 - 150, height / 2 + 210);
  buttons.push(createButton('Purple'));
  buttons[5].position(width / 2 + 25, height / 2 + 210);
  buttons.push(createButton('Orange'));
  buttons[6].position(width / 2 - 150, height / 2 + 290);
  buttons.push(createButton('Brown'));
  buttons[7].position(width / 2 + 25, height / 2 + 290);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].class('roundButton');
    buttons[i].attribute('c', buttons[i].html());
    buttons[i].mousePressed(buttonPressed);
  }

  infoButton = createImg('info.png', 'error loading image');
  infoButton.position(width - 50, 30);
  infoButton.class('infoButton');
  infoButton.mousePressed(openInfo);

  moreButton = createImg('more.png', 'error loading image');
  moreButton.position(30, 30);
  moreButton.class('moreButton');
  moreButton.mousePressed(openMore);


  pickNewColor();
}

function draw() {
}
