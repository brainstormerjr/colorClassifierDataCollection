let rSlider, gSlider, bSlider, trainButton, infoButton, modalCloseButton; //dom elements

modalCloseButton = document.getElementsByClassName('close')[0];

function setColor(r, g, b) {
  stroke(0);
  strokeWeight(5);
  fill(color(r, g, b));
  rectMode(CENTER);
  rect(width / 2, height / 4, 300, 300, 20);
  fill(255);
  rect(width / 2, height - 290, 300, 200, 20);
  rect(width / 2, height - 110, 300, 135, 20);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text('R:', width / 2 - 110, height- 330);
  text('G:', width / 2 - 110, height- 280);
  text('B:', width / 2 - 110, height- 230);
  text(r, width/2, height - 350);
  text(g, width/2, height - 300);
  text(b, width/2, height - 250);
  text('Prediction:', width/2, height - 130);
  textSize(40);
  text(prediction, width/2, height - 90);
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

function drawLoadingBar(current, target) {
  let x = map(current, 0, target, 0, width);
  noStroke();
  fill(0, 255, 0);
  rectMode(CORNER);
  rect(0, height - 30, x, 30);
  strokeWeight(5);
  stroke(0);
  noFill();
  rect(0, height - 30, width, 30);
  fill(0);
  noStroke();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(20);
  if (current == target) {
    text('Training completed', 10, height - 14);
  } else {
    if (target) {
      let percentage = (current / target) * 100;
      if (percentage < 10) {
        percentage = nf(percentage, 1, 2);
      } else {
        percentage = nf(percentage, 2, 2);
      }
      text(`Training progress: ${current} / ${target} (${percentage}%)`, 10, height - 14);
    } else {
      text('Training progress: calculating...', 10, height - 14);
    }
  }
}

function setupDom() {

  //slider dimensions: width 300 height 20

  let r = floor(random(256));
  let g = floor(random(256));
  let b = floor(random(256));

  rSlider = createSlider(0, 255, r, 1);
  rSlider.class('colorSlider');
  rSlider.position(width / 2 - 80, height - 340);
  gSlider = createSlider(0, 255, g, 1);
  gSlider.class('colorSlider');
  gSlider.position(width / 2 - 80, height - 290);
  bSlider = createSlider(0, 255, b, 1);
  bSlider.class('colorSlider');
  bSlider.position(width / 2 - 80, height - 240);

  trainButton = createButton('FETCHING DATA...');
  trainButton.class('trainButton');
  trainButton.position(width / 2 - 150, height - 177.5);
  trainButton.mousePressed(train);
  document.getElementsByClassName('trainButton')[0].disabled = true;

  moreButton = createImg('more.png', 'error loading image');
  moreButton.position(30, 30);
  moreButton.class('moreButton');
  moreButton.mousePressed(openMore);

  infoButton = createImg('info.png', 'error loading image');
  infoButton.position(width - 50, 30);
  infoButton.class('infoButton');
  infoButton.mousePressed(openInfo);

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

function openInfo() {
  //print('opening info');
  modal.style.display = 'block';
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};