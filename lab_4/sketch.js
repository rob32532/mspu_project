let gameObjects = {
  stage: 0,

  character: {
    x: 200,
    y: innerHeight - innerHeight / 4,
    state: "charFront",
    moveSpeed: 7,
    jump: false,
    direction: 1,
    velocity: 2,
    jumpPower: 10,
    fallingSpeed: 7,
    minHeight: innerHeight - innerHeight / 4,
    maxHeight: 0,
    jumpCounter: 0,

    render: {
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
        // Base legs
        line(x + 10, y - 30, x + 10, y);
        line(x - 10, y - 30, x - 10, y);

        // Leg endings based on type
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
      }
    }
  },

  enemy: {
    x: 410,
    y: innerHeight - innerHeight / 4,
    sizeX: 15,
    sizeY: 15,
    state: "enemyRight",
    dotLeft: 400,
    dotRight: 700,
    direction: 1,
    rand: 0,

    render(x, y, direction) {
      stroke("#000000");
      strokeWeight(2);
      fill("#5e29b1");
      rect(this.x - this.sizeX, this.y, this.sizeX * 2, this.sizeY * -2);
      fill("#ffffff");
      circle(this.x + (direction === "left" ? -this.sizeX : this.sizeX), this.y - this.sizeY, 10);
    }
  },

  environment: {
    render: {
      x: innerWidth,
      y: innerHeight,
      h: innerHeight / 4,
      base() {
        noStroke();
        fill(0, 155, 0);
        rect(0, this.y - this.h, this.x, this.y);
      },

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
        triangle(650, this.y - this.h - 350, 450, this.y - this.h, 850, this.y - this.h);
        fill(80);
        triangle(725, this.y - this.h - 250, 600, this.y - this.h, 850, this.y - this.h);
      },

      tree() {
        noStroke();
        fill(123, 63, 0);
        quad(895, (this.y - this.h) - 90, 915, (this.y - this.h) - 90, 925, (this.y - this.h), 885, (this.y - this.h));
        fill(0, 100, 0);
        ellipse(905, (this.y - this.h) - 80, 50, 80);
      },

      canyon() {},

      apple() {
        noStroke();
        fill("#c42020");
        circle(350, (this.y - this.h) - 25, 50);
        fill("#3b2713");
        quad(350, (this.y - this.h) - 48, 360, (this.y - this.h) - 46, 363, (this.y - this.h) - 65, 355, (this.y - this.h) - 65);
      }
    }
  }
};

function draw() {
  createCanvas(innerWidth, innerHeight);
  background(100, 155, 255);
  if (gameObjects.stage == 0) {
    const env = gameObjects.environment.render;
    env.cloud();
    env.mountain();
    env.tree();
    env.canyon();
    env.apple();
    env.base();
    gameObjects.enemy.rand = Math.floor(Math.random() * (10 - 1)) + 1;
    renderCharacter();
    renderEnemy();
    gravity();
    charControl();
    enemyMovement();
  }
}

function renderCharacter() {
  const char = gameObjects.character;
  const render = char.render;

  render.body(char.x, char.y);

  switch (char.state) {
    case "charJump":
      render.eyes(char.x, char.y);
      render.legs(char.x, char.y, "jump");
      break;
    case "charLeft":
      render.eyes(char.x, char.y, "left");
      render.legs(char.x, char.y, "left");
      break;
    case "charRight":
      render.eyes(char.x, char.y, "right");
      render.legs(char.x, char.y, "right");
      break;
    case "charJumpLeft":
      render.eyes(char.x, char.y, "left");
      render.legs(char.x, char.y, "jumpLeft");
      break;
    case "charJumpRight":
      render.eyes(char.x, char.y, "right");
      render.legs(char.x, char.y, "jumpRight");
      break;
    default:
      render.eyes(char.x, char.y);
      render.legs(char.x, char.y, "front");
      break;
  }
}

function renderEnemy() {
  const enemy = gameObjects.enemy;
  enemy.render(enemy.x, enemy.y, enemy.state === "enemyLeft" ? "left" : "right");
}

function charControl() {
  const char = gameObjects.character;
  if (char.x < -10) char.x = innerWidth;
  if (char.x > innerWidth) char.x = 0;
  if (keyIsDown(UP_ARROW)) {
    char.jump = true;
    char.state = "charJump";
  }
  if (keyIsDown(DOWN_ARROW)) {
    char.state = "charFront";
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (keyIsDown(UP_ARROW)) {
      char.x += char.moveSpeed;
      char.jump = true;
      char.state = "charJumpRight";
    } else {
      char.x += char.moveSpeed;
      char.state = "charRight";
    }
  }
  if (keyIsDown(LEFT_ARROW)) {
    if (keyIsDown(UP_ARROW)) {
      char.x -= char.moveSpeed;
      char.jump = true;
      char.state = "charJumpLeft";
    } else {
      char.x -= char.moveSpeed;
      char.state = "charLeft";
    }
  }
}

function enemyMovement() {
  const enemy = gameObjects.enemy;
  enemy.x += enemy.rand * enemy.direction;

  if (enemy.x <= enemy.dotLeft) {
    enemy.x += enemy.dotLeft - enemy.x;
    enemy.direction *= -1;
    enemy.state = "enemyRight";
  } else if (enemy.x >= enemy.dotRight) {
    enemy.x -= enemy.x - enemy.dotRight;
    enemy.direction *= -1;
    enemy.state = "enemyLeft";
  }
}

function gravity() {
  const char = gameObjects.character;

  if (char.y >= char.minHeight && char.jump == false) {
    char.y = char.y;
    char.jumpCounter = 0;
    char.state = "charFront";
  } else {
    char.y = char.y + char.direction * char.velocity;
  }

  if (char.jump) {
    if (char.y <= char.maxHeight || char.jumpCounter >= char.jumpPower) {
      if (char.y >= char.minHeight) {
        char.y = char.minHeight;
        char.jump = false;
      } else {
        char.velocity = char.fallingSpeed;
      }
    } else {
      char.velocity = -char.jumpPower;
      char.jumpCounter = char.jumpCounter + 1;
    }
  } else {
    char.velocity = char.fallingSpeed;
  }
}
