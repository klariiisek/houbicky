let houby = [];
let muchomurkaImage;
let hribImage;
let kosikImage;
let backgroundImage;
let hamSound;
let endSound;
let kosik;
let gameOver = false;

class Kosik {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.speed = 5;
    this.points = 3; // Počáteční počet bodů
    this.color = color(random(255), random(255), random(255));
  }

  draw() {
    if (kosikImage) {
      imageMode(CENTER);
      image(kosikImage, this.x, this.y, this.width, this.height);
    } else {
      fill(this.color);
      rect(this.x, this.y, this.width, this.height);
    }
    // Zobrazení počtu bodů
    textSize(32);
    fill(255);
    text('Body: ' + this.points, 10, 30);
  }

  move(dx, dy) {
    this.x = constrain(this.x + dx * this.speed, width/2, width/2 - this.width/2);
    this.y = constrain(this.y + dy * this.speed, height/2, height/2 - this.height/2);
  }

  detectCollision(houba) {
    return (
      houba.x > this.x - this.width / 2 &&
      houba.x < this.x + this.width / 2 &&
      houba.y > this.y - this.height / 2 &&
      houba.y < this.y + this.height / 2
    );
  }
}

class Houba {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.size = random(70, 90);
    this.speed = random(1, 3);
    this.color = color(random(255), random(255), random(255));
    this.image = random([muchomurkaImage, hribImage]);
  }

  draw() {
    if (muchomurkaImage && hribImage) {
      imageMode(CENTER);
      image(this.image, this.x, this.y, this.size / 2, this.size / 2);
    } else {
      fill(this.color);
      circle(this.x, this.y, this.size);
    }
  }

  update() {
    this.y += this.speed;
  }
}

function preload() {
  muchomurkaImage = loadImage('muchomurka.png');
  hribImage = loadImage('hrib.png');
  kosikImage = loadImage('kosik.png');
  backgroundImage = loadImage('les.jpg');
  hamSound = loadSound('ham.wav');
  endSound = loadSound('konecHry.wav');
}

function setup() {
  createCanvas(800, 800);
  kosik = new Kosik(400, 750);
  document.getElementById("restart-button").onclick = restartGame;
}

function draw() {
  if (gameOver) return;

  if (backgroundImage) {
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
  } else {
    background(20);
  }

  if (random(1) < 0.02) houby.push(new Houba());
  for (let i = 0; i < houby.length; i++) {
    houby[i].update();
    houby[i].draw();
    if (kosik.detectCollision(houby[i])) {
      if (houby[i].image === hribImage) {
        kosik.points++;
        hamSound.play();
        // Přičítání bodu za hříbek
      } else if (houby[i].image === muchomurkaImage) {
        kosik.points--;
        hamSound.play();
        // Odečítání bodu za muchomůrku
      }
      houby.splice(i, 1);
      if (kosik.points < 1) {
        endSound.play();
        endGame();
      }
    } else if (houby[i].y > height + 20) {
      houby.splice(i, 1);
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    kosik.move(-1, 0);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    kosik.move(1, 0);
  }
  if (keyIsDown(UP_ARROW)) {
    kosik.move(0, -1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    kosik.move(0, 1);
  }
  kosik.draw();
}

function endGame() {
  gameOver = true;
  document.getElementById("restart-button").style.display = "block";
}

function restartGame() {
  gameOver = false;
  kosik = new Kosik(400, 750);
  houby = [];
  document.getElementById("restart-button").style.display = "none";
}
