let countCanyons = 2;
let canyons = [];
let floor;
let character;
let enemy;
let environment;
var deathSound = new Audio("death_sound.mp3");
let font;
let stage = "startScreen";

function preload() {
  font = loadFont("pricedow.ttf");
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  deathSound.volume = 0.2;

  floor = {
    height: innerHeight / 4,
    color: color(0, 155, 0),
    drawFloor: function () {
      noStroke();
      fill(this.color);
      rect(0, height - this.height, width, this.height);
    }
  };

  for (let i = 0; i < countCanyons; i++) {
    canyons.push({
      x: 700 + i * 400,
      y: height - floor.height,
      width: 150,
      drawCanyon: function () {
        fill(100);
        rect(this.x, this.y, this.width, floor.height);
      }
    });
  }

  character = {
    x: 200,
    y: innerHeight - innerHeight / 4,
    height: 10,
    width: 10,
    state: "charFront",
    moveSpeed: 7,
    direction: 1,
    fallingSpeed: 0,
    jumpSpeed: 15,
    gravity: 0.8,
    minHeight: innerHeight - innerHeight / 4,
    maxHeight: 0,
    grounded: true,
    dead: false,
    isJumping: false,
    deathFallSpeed: 0,
    currentCanyon: null,

    body(x, y) {
      noStroke();
      fill("#ffc500");
      circle(x, y - 50, 50);
    },

    eyes(x, y, direction) {
      fill("#000000");
      if (direction !== "left") circle(x + 15, y - 50, 10);
      if (direction !== "right") circle(x - 15, y - 50, 10);
      fill("#e2dddf");
      if (direction !== "left") circle(x + 15, y - 50, 5);
      if (direction !== "right") circle(x - 15, y - 50, 5);
    },

    legs(x, y, type) {
      stroke("#ffc500");
      strokeWeight(5);
      line(x + 10, y - 30, x + 10, y);
      line(x - 10, y - 30, x - 10, y);

      switch (type) {
        case "front":
          line(x + 10, y, x + 20, y);
          line(x - 10, y, x - 20, y);
          break;
        case "right":
          line(x + 10, y, x + 20, y);
          line(x - 10, y, x, y);
          break;
        case "left":
          line(x + 10, y, x, y);
          line(x - 10, y, x - 20, y);
          break;
        case "jump":
          line(x + 10, y, x + 15, y + 5);
          line(x - 10, y, x - 15, y + 5);
          break;
        case "jumpRight":
          line(x + 10, y, x + 20, y + 5);
          line(x - 10, y, x, y + 5);
          break;
        case "jumpLeft":
          line(x + 10, y, x, y + 5);
          line(x - 10, y, x - 20, y + 5);
          break;
      }
    },

    draw() {
      if (this.dead) {
        this.deathFallSpeed += this.gravity;
        this.y += this.deathFallSpeed;
        if (this.y < this.currentCanyon.y + floor.height) {
          this.body(this.x, this.y);
          this.eyes(this.x, this.y);
          this.legs(this.x, this.y, "front");
        }
        return;
      }

      switch (this.state) {
        case "charJump":
          this.body(this.x, this.y);
          this.eyes(this.x, this.y);
          this.legs(this.x, this.y, "jump");
          break;
        case "charLeft":
          this.body(this.x, this.y);
          this.eyes(this.x, this.y, "left");
          this.legs(this.x, this.y, "left");
          break;
        case "charRight":
          this.body(this.x, this.y);
          this.eyes(this.x, this.y, "right");
          this.legs(this.x, this.y, "right");
          break;
        case "charJumpLeft":
          this.body(this.x, this.y);
          this.eyes(this.x, this.y, "left");
          this.legs(this.x, this.y, "jumpLeft");
          break;
        case "charJumpRight":
          this.body(this.x, this.y);
          this.eyes(this.x, this.y, "right");
          this.legs(this.x, this.y, "jumpRight");
          break;
        default:
          this.body(this.x, this.y);
          this.eyes(this.x, this.y);
          this.legs(this.x, this.y, "front");
          break;
      }
    },

    control() {
      if (this.dead) return;

      if (this.x < -10) this.x = innerWidth;
      if (this.x > innerWidth) this.x = 0;

      if (keyIsDown(87) && this.grounded) {
        this.isJumping = true;
        this.grounded = false;
        this.fallingSpeed = -this.jumpSpeed;
        this.state = "charJump";
      }

      if (keyIsDown(68)) {
        this.x += this.moveSpeed;
        this.state = this.isJumping ? "charJumpRight" : "charRight";
      }

      if (keyIsDown(65)) {
        this.x -= this.moveSpeed;
        this.state = this.isJumping ? "charJumpLeft" : "charLeft";
      }

      this.fallingSpeed += this.gravity;
      this.y += this.fallingSpeed;

      if (this.y >= this.minHeight) {
        this.y = this.minHeight;
        this.fallingSpeed = 0;
        this.grounded = true;
        this.isJumping = false;
        if (!keyIsDown(65) && !keyIsDown(68)) {
          this.state = "charFront";
        }
      }
    },

    checkCanyon(canyon) {
      if (this.x > canyon.x && this.x < canyon.x + canyon.width && this.y >= canyon.y) {
        if (!this.dead) {
          this.dead = true;
          this.currentCanyon = canyon;
          this.deathFallSpeed = 0;
          deathSound.play();
        }
      }
    }
  };

  enemy = {
    x: 600,
    y: innerHeight - innerHeight / 4,
    width: 15,
    height: 15,
    state: "enemyRight",
    dotLeft: 400,
    dotRight: 650,
    direction: 1,
    rand: 0,

    draw() {
      stroke("#000000");
      strokeWeight(2);
      fill("#5e29b1");
      rect(this.x - this.width, this.y, this.width * 2, this.height * -2);
      fill("#ffffff");
      circle(
        this.x + (this.state === "enemyLeft" ? -this.width : this.width),
        this.y - this.height,
        this.width * (2 / 3)
      );
    },

    move() {
      this.x += this.rand * this.direction;

      if (this.x <= this.dotLeft) {
        this.x += this.dotLeft - this.x;
        this.direction *= -1;
        this.state = "enemyRight";
      } else if (this.x >= this.dotRight) {
        this.x -= this.x - this.dotRight;
        this.direction *= -1;
        this.state = "enemyLeft";
      }
    }
  };

  environment = {
    x: innerWidth,
    y: innerHeight,
    h: innerHeight / 4,

    cloud() {
      noStroke();
      fill(250);
      circle(500, 100, 100);
      circle(550, 90, 60);
      ellipse(520, 120, 175, 80);
    },

    mountain() {
      noStroke();
      fill(100);
      triangle(450, this.y - this.h - 350, 250, this.y - this.h, 650, this.y - this.h);
      fill(80);
      triangle(525, this.y - this.h - 250, 400, this.y - this.h, 650, this.y - this.h);
    }
  };
}

function mousePressed() {
  if (stage === "startScreen") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
      stage = "gameScreen";
    }
  } else if (stage === "deathScreen") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
      character.dead = false;
      character.x = 200;
      character.y = innerHeight - innerHeight / 4;
      character.fallingSpeed = 0;
      character.deathFallSpeed = 0;
      character.currentCanyon = null;
      deathSound.pause();
      deathSound.currentTime = 0;
      stage = "gameScreen";
    }
  }
}

function drawStartScreen() {
  background(100, 155, 255);
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(255);
  text("ADVENTURE", width / 2, height / 3);

  fill(0, 155, 0);
  rect(width / 2 - 100, height / 2 - 25, 200, 50);
  fill(255);
  textSize(30);
  text("START GAME", width / 2, height / 2);
}

function drawDeathScreen() {
  noStroke();
  background(0, 0, 0, 40);
  textAlign(CENTER, CENTER);
  textSize(200);
  textFont(font);
  fill(255, 0, 0);
  text("WASTED", width / 2, height / 3);

  fill(200, 0, 0);
  rect(width / 2 - 100, height / 2 + 50, 200, 50);
  fill(255);
  textSize(30);
  text("RETRY", width / 2, height / 2 + 75);
}

function draw() {
  switch (stage) {
    case "startScreen":
      drawStartScreen();
      break;
    case "gameScreen":
      background(100, 155, 255);
      floor.drawFloor();

      for (let i = 0; i < canyons.length; i++) {
        canyons[i].drawCanyon();
        if (!character.dead) {
          character.checkCanyon(canyons[i]);
        }
      }

      environment.cloud();
      environment.mountain();

      enemy.rand = Math.floor(Math.random() * (10 - 1)) + 1;
      enemy.draw();
      enemy.move();

      character.draw();
      character.control();

      if (character.dead) {
        if (character.y > height - 10) stage = "deathScreen";
      }
      break;
    case "deathScreen":
      drawDeathScreen();
      break;
  }
}
