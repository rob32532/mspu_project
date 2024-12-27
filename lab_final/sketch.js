let background01;
let pixelFont;
let jumpSound;
let deathSound;
let groundLeftTile;
let groundRightTile;
let groundMiddleTile;
let enemyWalkRight;
let enemyWalkLeft;
let characterIdleRight;
let characterIdleLeft;
let characterRunRight;
let characterRunLeft;
let characterJumpUpRight;
let characterJumpUpLeft;
let animationStart;
let groundLevel = innerHeight - (innerHeight * 1) / 4;

function preload() {
    background01 = loadImage("background1.png");

    pixelFont = loadFont("./fonts/PixelifySans-Regular.ttf");

    jumpSound = new Audio("./sounds/character/jump.wav");
    deathSound = new Audio("./sounds/character/death.wav");

    groundLeftTile = loadImage("./sprites/tiles/groundLeftSide.png");
    groundRightTile = loadImage("./sprites/tiles/groundRightSide.png");
    groundMiddleTile = loadImage("./sprites/tiles/groundMiddle.png");

    enemyWalkRight = loadImage("./sprites/enemy/walkRight.gif");
    enemyWalkLeft = loadImage("./sprites/enemy/walkLeft.gif");

    characterIdleRight = loadImage("./sprites/character/idleRight.gif");
    characterIdleLeft = loadImage("./sprites/character/idleLeft.gif");
    characterRunRight = loadImage("./sprites/character/runRight.gif");
    characterRunLeft = loadImage("./sprites/character/runLeft.gif");
    characterJumpUpRight = loadImage("./sprites/character/jumpUpRight.gif");
    characterJumpUpLeft = loadImage("./sprites/character/jumpUpLeft.gif");
    characterFallRight = loadImage("./sprites/character/fallRight.gif");
    characterFallLeft = loadImage("./sprites/character/fallLeft.gif");
    characterDeathRight = loadImage("./sprites/character/deathRight.gif");
    characterDeathLeft = loadImage("./sprites/character/deathLeft.gif");
}

class Movable {
    constructor() {
        this.startPosX = 0;
        this.velocity = character.velocity;
        this.minX = 100;
        this.maxX = innerHeight - innerHeight * 0.25;
        this.isMoved = false;
        this.isMovedLeft = false;
        this.isMovedRight = false;
    }

    update() {
        const characterX = character.x;

        if (character.isRun) {
            if (
                characterX < this.minX &&
                (character.state == "runLeft" || character.state == "jumpLeft") &&
                this.startPosX <= -1
            ) {
                this.startPosX -= this.velocity * -1;
                this.isMovedLeft = true;
                this.isMoved = true;
            } else {
                this.isMovedLeft = false;
                this.isMoved = false;
            }
            if (characterX > this.maxX && (character.state == "runRight" || character.state == "jumpRight")) {
                this.startPosX += this.velocity * -1;
                this.isMovedRight = true;
                this.isMoved = true;
            } else {
                this.isMovedRight = false;
                this.isMoved = false;
            }
        }
    }
}

class Ground extends Movable {
    constructor(x, y, width, height, numTiles) {
        super();
        this.x = x;
        this.y = y;
        this.width = this.numTiles * this.tileSize;
        this.height = height;
        this.leftTile = groundLeftTile;
        this.middleTile = groundMiddleTile;
        this.rightTile = groundRightTile;
        this.tileSize = groundMiddleTile.width;
        this.numTiles = numTiles;
        this.startPosX = 0;
    }

    update() {
        this.display();
        super.update();
    }

    display() {
        push();
        translate(this.startPosX + this.x, this.y);

        image(this.leftTile, 0, 0, this.tileSize, this.height);

        for (let i = 1; i < this.numTiles - 1; i++) {
            image(this.middleTile, i * this.tileSize, 0, this.tileSize, this.height);
        }

        if (this.numTiles > 1) {
            image(this.rightTile, (this.numTiles - 1) * this.tileSize, 0, this.tileSize, this.height);
        }

        pop();
    }
}

class Canyon extends Movable {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startPosX = 0;
    }

    update() {
        this.display();
        super.update();
    }

    display() {
        push();
        translate(this.startPosX + this.x, this.y);

        noFill();
        rect(0, 0, this.width, this.height);

        pop();
    }
}

class Enemy extends Movable {
    constructor(x, y, leftBorder, rightBorder) {
        super();
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.velocity = 2.5;
        this.leftBorder = leftBorder;
        this.rightBorder = rightBorder;
        this.isDead = false;
        this.state = "walkRight";
        this.direction = true;
    }

    update() {
        super.update();
        push();
        translate(this.startPosX, 0);
        this.display();
        this.move();
        pop();
    }

    move() {
        if (!this.isDead) {
            if (this.isMovedLeft && character.isRun) {
                this.x += this.direction ? 3.75 : 0; // ? right(true) : left(false)
            } else if (this.isMovedRight && character.isRun) {
                this.x += this.direction ? 0 : -3.75; // ? right(true) : left(false)
            } else {
                this.x += this.direction ? this.velocity : -this.velocity; // ? right(true) : left(false)
            }

            let leftBorder = this.leftBorder + this.startPosX;
            let rightBorder = this.rightBorder + this.startPosX;

            if (this.x <= leftBorder) {
                this.x += leftBorder - this.x;
                this.direction = true;
                this.state = "walkRight";
            } else if (this.x >= rightBorder) {
                this.x -= this.x - rightBorder;
                this.direction = false;
                this.state = "walkLeft";
            }
        }
    }

    display() {
        switch (this.state) {
            case "walkRight":
                image(enemyWalkRight, this.x - this.width / 2, this.y - this.height);
                break;
            case "walkLeft":
                image(enemyWalkLeft, this.x - this.width / 2, this.y - this.height);
                break;
            default:
                image(enemyWalkRight, this.x - this.width / 2, this.y - this.height);
                break;
        }
    }
}

function gameScreen() {}

function deathScreen() {}

function winScreen() {}

function setup() {
    createCanvas(5000, innerHeight);

    textFont(pixelFont);

    let masterVolume = 1;

    jumpSound.volume = masterVolume;
    deathSound.volume = masterVolume;

    character = {
        x: 200,
        y: groundLevel - 100,
        width: 24,
        height: 48,
        state: "idleRight",
        velocity: 5,
        jumpVelocity: 14,
        fallSpeed: 0,
        deathFallSpeed: 0,
        gravity: 0.8,
        groundLevel: groundLevel,
        direction: true,
        currentCanyon: 0,
        visible: true,
        isRun: false,
        isGrounded: true,
        isJump: false,
        isDead: false,
        isDeadCanyon: false,
        isDeadEnemy: false,

        draw() {
            if (this.isDead) {
                if (this.isDeadCanyon) {
                    this.deathFallSpeed += this.gravity;
                    this.y += this.deathFallSpeed;
                    deathSound.play();
                    if (this.y >= innerHeight + 200) {
                        deathSound.pause();
                    }

                    if (this.y < this.currentCanyon.y + groundLevel) {
                        this.state = this.direction ? "fallRight" : "fallLeft";
                    }
                } else if (this.isDeadEnemy) {
                    this.state = this.direction ? "deathRight" : "deathLeft";
                    deathSound.play();
                    let animationDuration = 1700;
                    animationStart = millis();
                    let elapsedTime = animationDuration - animationStart;
                    if (elapsedTime <= 0) {
                        this.visible = false;
                        deathSound.pause();
                    }
                }
            }
            if (this.visible) {
                switch (this.state) {
                    case "idleRight":
                        image(characterIdleRight, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "idleLeft":
                        image(characterIdleLeft, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "runRight":
                        image(characterRunRight, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "runLeft":
                        image(characterRunLeft, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "jumpRight":
                        image(characterJumpUpRight, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "jumpLeft":
                        image(characterJumpUpLeft, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "fallRight":
                        image(characterFallRight, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "fallLeft":
                        image(characterFallLeft, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "deathRight":
                        image(characterDeathRight, this.x - this.width / 2, this.y - this.height);
                        break;
                    case "deathLeft":
                        image(characterDeathLeft, this.x - this.width / 2, this.y - this.height);
                        break;
                    default:
                        image(characterIdleRight, this.x - this.width / 2, this.y - this.height);
                        break;
                }
            }
        },
        control() {
            if (this.isDead) return;

            if (keyIsDown(87) && this.isGrounded) {
                this.isJump = true;
                this.isGrounded = false;
                this.fallSpeed = -this.jumpVelocity;
                jumpSound.play();
                this.state = this.direction ? "jumpRight" : "jumpLeft";
            }

            if (keyIsDown(68)) {
                if (!ground.isMovedRight && this.x < width) this.x += this.velocity;
                this.state = this.isJump ? "jumpRight" : "runRight";
                this.isRun = true;
                this.direction = true;
            }

            if (keyIsDown(65)) {
                if (!ground.isMovedLeft && this.x > width - width) this.x -= this.velocity;
                this.state = this.isJump ? "jumpLeft" : "runLeft";
                this.isRun = true;
                this.direction = false;
            }

            this.fallSpeed += this.gravity;
            this.y += this.fallSpeed;

            if (this.y >= this.groundLevel) {
                this.y = this.groundLevel;
                this.fallSpeed = 0;
                this.isGrounded = true;
                this.isJump = false;
                jumpSound.pause();
                jumpSound.currentTime = 0;
                if (!keyIsDown(65) && !keyIsDown(68)) {
                    this.state = this.direction ? "idleRight" : "idleLeft";
                    this.isRun = false;
                }
            }
        },

        checkCanyon(canyons) {
            for (let i = 0; i < canyons.length; i++) {
                const canyon = canyons[i];
                let canyonX = canyon.x + canyon.startPosX;
                if (this.x > canyonX && this.x + this.width < canyonX + canyon.width && this.y >= canyon.y) {
                    if (!this.isDead) {
                        this.isDead = true;
                        this.isDeadCanyon = true;
                        this.currentCanyon = canyon;
                        this.deathFallSpeed = 0;
                    }
                }
            }
        },

        checkCollision(rectA, rectB) {
            return (
                rectA.x < rectB.x + rectB.width / 2 &&
                rectA.x + rectA.width > rectB.x - rectB.width / 2 &&
                rectA.y < rectB.y + rectB.height &&
                rectA.y + rectA.height > rectB.y
            );
            /*noFill();
            rect(rectB.x - rectB.width / 2, rectB.y, rectB.width, -rectB.height);
            rect(rectA.x, rectA.y, rectA.width, -rectA.height);*/
        },

        deathFromEnemy(e) {
            if (this.checkCollision(character, e)) {
                if (this.y <= e.y - e.height + (e.height * 2) / 3 && this.y >= e.y - e.height) {
                    e.isDead = true;
                } else if (this.y >= e.y - e.height + (e.height * 2) / 3 && this.y <= e.y) {
                    this.isDead = true;
                    this.isDeadEnemy = true;
                }
            }
        }
    };

    enemy = new Enemy(450, groundLevel, 400, 500);

    ground = new Ground(0, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 8);
    canyon = new Canyon(ground.x + ground.numTiles * ground.tileSize, groundLevel, 100, groundMiddleTile.height);
    ground1 = new Ground(canyon.x + canyon.width, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 4);
    canyon1 = new Canyon(ground1.x + ground1.numTiles * ground1.tileSize, groundLevel, 0, groundMiddleTile.height);
    ground2 = new Ground(canyon1.x + canyon1.width, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 2);
}

function draw() {
    image(background01, 0, 0, innerWidth, innerHeight);

    ground.update();
    ground1.update();
    ground2.update();
    canyon.update();
    canyon1.update();

    enemy.update();

    if (!character.isDead) {
        character.checkCanyon([canyon, canyon1]);
    }

    character.draw();
    character.control();
    character.deathFromEnemy(enemy);

    fill(0);
    textSize(20);
    text("mouse: " + mouseX + ", " + mouseY, 20, 20);
    text("character: " + character.x + ", " + character.y, 20, 40);
    text("enemy: " + enemy.x + ", " + enemy.y, 20, 60);
    text("leftBorder: " + enemy.leftBorder + ", rightBorder" + enemy.rightBorder, 20, 80);
}
