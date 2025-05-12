let background01;

let settingsIcoW;
let settingsIcoB;
let settingsMenuOpened = false;
let restartIco;

let helpIsOpened;

//let soundIco01W;
//let soundIco02W;
//let soundIco03W;
//let soundIco04W;

let soundIco01B;
let soundIco02B;
let soundIco03B;
let soundIco04B;

let soundMenuOpened = false;

let pixelFont;

let masterVolume = 0.5;
let storedVolume = 0.5;
let isDragging = false;
let storedDotY = 0;

let jumpSound;
let deathSound;

let runningTutorial;
let jumpTutorial;
let platformFallTutorial;

let flowersProps;
let grassProps;
let grassDryProps;

let groundLeftTile;
let groundRightTile;
let groundMiddleTile;

let platformLeftTile;
let platformMiddle;
let platformRightTile;

let enemyWalkRight;
let enemyWalkLeft;
let enemyDeathRight;
let enemyDeathLeft;

let characterIdleRight;
let characterIdleLeft;
let characterRunRight;
let characterRunLeft;
let characterJumpUpRight;
let characterJumpUpLeft;
let mouseClick;
let gameState = "game";
let groundLevel = innerHeight - (innerHeight * 1) / 4;

let gameStartTime = 0;
const animationDuration = 720;

function preload() {
    background01 = loadImage("./assets/Textures/background/background.png");

    settingsIcoW = loadImage("./assets/UI/icons/settingsWhite.ico");
    settingsIcoB = loadImage("./assets/UI/icons/settingsBlack.ico");

    restartIco = loadImage("./assets/UI/icons/restart.ico");

    //soundIco01W = loadImage("./assets/UI/icons/sound01W.ico");
    //soundIco02W = loadImage("./assets/UI/icons/sound02W.ico");
    //soundIco03W = loadImage("./assets/UI/icons/sound03W.ico");
    //soundIco04W = loadImage("./assets/UI/icons/sound04W.ico");
    soundIco01B = loadImage("./assets/UI/icons/sound01B.ico");
    soundIco02B = loadImage("./assets/UI/icons/sound02B.ico");
    soundIco03B = loadImage("./assets/UI/icons/sound03B.ico");
    soundIco04B = loadImage("./assets/UI/icons/sound04B.ico");

    pixelFont = loadFont("./assets/Fonts/PixelifySans-Regular.ttf");
    
    runningTutorial = loadImage("./assets/Tutorials/runningTutorial.gif");
    jumpTutorial = loadImage("./assets/Tutorials/jumpTutorial.gif");
    platformFallTutorial = loadImage("./assets/Tutorials/platformFallTutorial.gif");

    flowersProps = loadImage("./assets/Textures/miscellaneous/flowers_props.png");
    grassProps = loadImage("./assets/Textures/miscellaneous/grass_props.png");
    grassDryProps = loadImage("./assets/Textures/miscellaneous/drygrass_props.png");

    groundLeftTile = loadImage("./assets/Textures/tiles/groundLeftSide.png");
    groundRightTile = loadImage("./assets/Textures/tiles/groundRightSide.png");
    groundMiddleTile = loadImage("./assets/Textures/tiles/groundMiddle.png");

    platformLeftTile = loadImage("./assets/Textures/platform/platformLeftSide.png");
    platformMiddleTile = loadImage("./assets/Textures/platform/platformMiddle.png");
    platformRightTile = loadImage("./assets/Textures/platform/platformRightSide.png");

    enemyWalkRight = loadImage("./assets/Characters/enemy/walkRight.gif");
    enemyWalkLeft = loadImage("./assets/Characters/enemy/walkLeft.gif");
    enemyDeathRight = loadImage("./assets/Characters/enemy/deathRight.gif");
    enemyDeathLeft = loadImage("./assets/Characters/enemy/deathLeft.gif");

    characterIdleRight = loadImage("./assets/Characters/hero/idleRight.gif");
    characterIdleLeft = loadImage("./assets/Characters/hero/idleLeft.gif");
    characterRunRight = loadImage("./assets/Characters/hero/runRight.gif");
    characterRunLeft = loadImage("./assets/Characters/hero/runLeft.gif");
    characterJumpUpRight = loadImage("./assets/Characters/hero/jumpUpRight.gif");
    characterJumpUpLeft = loadImage("./assets/Characters/hero/jumpUpLeft.gif");
    characterFallRight = loadImage("./assets/Characters/hero/fallRight.gif");
    characterFallLeft = loadImage("./assets/Characters/hero/fallLeft.gif");
    characterDeathRight = loadImage("./assets/Characters/hero/deathRight.gif");
    characterDeathLeft = loadImage("./assets/Characters/hero/deathLeft.gif");
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

class Tutorial extends Movable {
    costructor() {
        
    }
}

class Ground extends Movable {
    constructor(x, y, width, height, numTiles) {
        super();
        this.x = x;
        this.y = y;
        this.height = height;
        this.leftTile = groundLeftTile;
        this.middleTile = groundMiddleTile;
        this.rightTile = groundRightTile;
        this.tileSize = groundMiddleTile.width;
        this.numTiles = numTiles;
        this.width = this.numTiles * this.tileSize;
        this.startPosX = 0;

        this.initProps();
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

        this.drawProps();
    }

    drawProps() {
        push();
        translate(this.startPosX + this.x, this.y);

        const displayWidth = 48;

        for (let p of this.props) {
            let img;
            switch (p.type) {
                case 0:
                    img = grassProps;
                    break;
                case 1:
                    img = grassDryProps;
                    break;
                case 2:
                    img = flowersProps;
                    break;
            }
            const displayHeight = img.height * (displayWidth / img.width);
            image(img, p.x, -displayHeight, displayWidth, displayHeight);
        }

        pop();
    }

    initProps() {
        this.props = [];

        const minStep = 32;
        const maxStep = 96;

        randomSeed(this.x);
        let cursorX = random(minStep, maxStep) / 2;

        while (true) {
            if (cursorX + 48 > this.width) break;

            const type = floor(random(3));
            this.props.push({ x: cursorX, type });

            cursorX += random(minStep, maxStep);
        }
    }
}

class Platform extends Movable {
    constructor(x, y, width, height, numTiles) {
        super();
        this.x = x;
        this.y = y;
        this.height = height;
        this.leftTile = platformLeftTile;
        this.middleTile = platformMiddleTile;
        this.rightTile = platformRightTile;
        this.tileSize = platformMiddleTile.width;
        this.numTiles = numTiles;
        this.width = this.numTiles * this.tileSize;
        this.startPosX = 0;
    }

    update() {
        this.display();
        super.update();
    }

    display() {
        push();
        translate(this.startPosX + this.x, this.y);
        scale(0.5);

        image(this.leftTile, 0, 0, this.tileSize, this.height);

        for (let i = 1; i < this.numTiles - 1; i++) {
            image(this.middleTile, i * this.tileSize, 0, this.tileSize, this.height);
        }

        if (this.numTiles > 1) {
            image(this.rightTile, (this.numTiles - 1) * this.tileSize, 0, this.tileSize, this.height);
        }

        //circle(0, 0, 10);
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

        noStroke();
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
        this.isDeadTrue = false;
        this.state = "walkRight";
        this.direction = true;
        this.animationStart = null;
        this.visible = true;
    }

    update() {
        if (!this.visible) return;
        super.update();
        push();
        translate(this.startPosX, 0);
        this.display();
        this.move();
        pop();
    }

    move() {
        if (this.isDead) return;
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

    display() {
        if (this.isDead) {
            let anim = this.direction ? enemyDeathRight : enemyDeathLeft;
            anim.play();

            let animationDuration = 600;
            let elapsedTime = millis() - this.animationStart;

            if (elapsedTime >= animationDuration) {
                this.visible = false;
            }
        }
        switch (this.state) {
            case "walkRight":
                image(enemyWalkRight, this.x - this.width / 2, this.y - this.height);
                break;
            case "walkLeft":
                image(enemyWalkLeft, this.x - this.width / 2, this.y - this.height);
                break;
            case "deathRight":
                image(enemyDeathRight, this.x - this.width / 2, this.y - this.height);
                break;
            case "deathLeft":
                image(enemyDeathLeft, this.x - this.width / 2, this.y - this.height);
                break;
            default:
                image(enemyWalkRight, this.x - this.width / 2, this.y - this.height);
                break;
        }
    }
}

function settings() {
    let x = 15;
    let y = 10;
    let mx = mouseX;
    let my = mouseY;
    let size = 30;
    let mnx = x - 5;
    let mny = y + size;
    let mnSizeX = size + 10;
    let mnSizeY = size * 4 - 5;

    const isOverIcon = mx >= x && mx <= x + size && my >= y && my <= y + size;
    const isOverMenu = settingsMenuOpened && mx >= mnx && mx <= mnx + mnSizeX && my >= mny && my <= mny + mnSizeY;

    settingsMenuOpened = isOverIcon || isOverMenu || soundMenuOpened;

    if (settingsMenuOpened) {
        fill("#ffffff");
        stroke(0);
        strokeWeight(1);
        rect(mnx, y - 5, mnSizeX, mnSizeY, 10);
        soundChange();
        image(restartIco, x, 80, size, size);
    }

    image(settingsMenuOpened ? settingsIcoB : settingsIcoW, x, y, size, size);
}

function soundChange() {
    let x = 15;
    let y = 45;
    let mx = mouseX;
    let my = mouseY;
    let size = 30;
    let mnx = x + 35;
    let mny = y - 40;
    let mnSizeX = size + 10;
    let mnSizeY = size * 4 - 5;
    let dotX = mnx + mnSizeX / 2;
    let dotY = mny + 20;
    let dotMinY = mny + 20;
    let dotMaxY = mny + mnSizeY - 20;

    const isOverIcon = mx >= x - 5 && mx <= x + size + 5 && my >= y && my <= y + size;
    const isOverMenu = soundMenuOpened && mx >= mnx && mx <= mnx + mnSizeX && my >= mny && my <= mny + mnSizeY;

    soundMenuOpened = isOverIcon || isOverMenu || isDragging;

    if (storedDotY === 0) {
        storedDotY = map(masterVolume, 0, 1, dotMaxY, dotMinY);
    }

    dotY = storedDotY;

    const distToDot = dist(mx, my, dotX, dotY);

    if (soundMenuOpened && mouseIsPressed) {
        if (distToDot <= 15) {
            isDragging = true;
        }
    }

    if (distToDot <= 15) {
        cursor(HAND);
    }

    if (!mouseIsPressed) {
        isDragging = false;
    }

    if (isDragging) {
        storedDotY = constrain(my, dotMinY, dotMaxY);

        masterVolume = map(storedDotY, dotMinY, dotMaxY, 1, 0);
    }

    if (soundMenuOpened) {
        fill("#ffffff");
        stroke(0);
        strokeWeight(1);
        rect(mnx, mny, mnSizeX, mnSizeY, 10);

        circle(dotX, dotY, 20);

        fill("#4a4a4a");
        strokeWeight(3);
        line(mnx + mnSizeX / 2, mny + 20, mnx + mnSizeX / 2, mny + mnSizeY - 20);
    }

    jumpSound.volume = masterVolume;
    deathSound.volume = masterVolume;

    if (masterVolume > 0.65) {
        image(soundIco04B, x, y, size, size);
    } else if (masterVolume > 0.35) {
        image(soundIco03B, x, y, size, size);
    } else if (masterVolume > 0) {
        image(soundIco02B, x, y, size, size);
    } else {
        image(soundIco01B, x, y, size, size);
    }
}

function restart() {
    createCanvas(5000, innerHeight);

    basefloor = groundLevel;

    textFont(pixelFont);

    jumpSound = new Audio("./assets/Sounds/character/jump.wav");
    deathSound = new Audio("./assets/Sounds/character/death.wav");

    characterDeathLeft.reset();
    characterDeathLeft.pause();
    characterDeathRight.reset();
    characterDeathRight.pause();

    enemyDeathLeft.reset();
    enemyDeathLeft.pause();
    enemyDeathRight.reset();
    enemyDeathRight.pause();

    character = {
        x: platformMiddleTile.width * 2 + 12,
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
        onPlatform: false,

        animationStart: null,

        draw() {
            if (this.isDead) {
                if (this.isDeadCanyon) {
                    this.deathFallSpeed += this.gravity;
                    this.y += this.deathFallSpeed;

                    if (this.y >= innerHeight + 200) {
                        deathSound.pause();
                        gameState = "death";
                    }

                    if (this.y < this.currentCanyon.y + groundLevel) {
                        this.state = this.direction ? "fallRight" : "fallLeft";
                    }
                } else if (this.isDeadEnemy) {
                    this.state = this.direction ? "deathRight" : "deathLeft";

                    let anim = this.direction ? characterDeathRight : characterDeathLeft;
                    anim.play();

                    let animationDuration = 720;
                    let elapsedTime = millis() - this.animationStart;

                    if (elapsedTime >= animationDuration) {
                        this.visible = false;
                        deathSound.pause();
                        gameState = "death";
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

            //circle(this.x, this.y, 10);
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

        checkUnderScreen() {
            if (this.y < height + 100) this.isDead = true;
        },

        checkCanyon(canyons) {
            for (let canyon of canyons) {
                let canyonX = canyon.x + canyon.startPosX;
                if (this.x > canyonX && this.x + this.width < canyonX + canyon.width && this.y >= canyon.y) {
                    if (!this.isDead) {
                        this.isDead = true;
                        this.isDeadCanyon = true;
                        this.currentCanyon = canyon;
                        this.deathFallSpeed = 0;
                        deathSound.play();
                    }
                }
            }
        },

        checkPlatform(platforms) {
            this.onPlatform = false;
            for (let platform of platforms) {
                const platformX = platform.x + platform.startPosX;
                const platformWidth = platform.width * 0.5;
                const platformRight = platformX + platformWidth;

                const betweenX = this.x + this.width >= platformX && this.x <= platformRight;

                if (betweenX) {
                    if (this.y <= platform.y && this.y + this.fallSpeed >= platform.y) {
                        this.groundLevel = platform.y;
                        this.onPlatform = true;
                        this.y = platform.y;
                        this.fallSpeed = 0;
                        this.isGrounded = true;
                        this.isJump = false;
                        jumpSound.pause();
                        jumpSound.currentTime = 0;
                        break;
                    }
                }
            }

            if (!this.onPlatform) {
                this.groundLevel = groundLevel;
            }

            if (keyIsDown(83) && this.onPlatform) {
                this.onPlatform = false;
                this.isGrounded = false;
                this.groundLevel = groundLevel;
            }
        },

        checkGround(grounds) {
            this.onGround = false;
            if (this.onPlatform) return;

            for (let ground of grounds) {
                const groundWorldX = ground.x + ground.startPosX;
                const groundLeft = groundWorldX;
                const groundRight = groundWorldX + ground.width;

                const betweenX = this.x >= groundLeft && this.x <= groundRight;
                const betweenY = this.y >= ground.y && this.y <= ground.y + ground.height;

                if (betweenX && this.y >= ground.y) {
                    this.onGround = true;
                    this.groundLevel = ground.y;
                    break;
                }
            }

            if (!this.onGround) {
                this.groundLevel = Infinity;
            }
        },

        checkCollision(rectA, rectB) {
            const aLeft = rectA.x - rectA.width / 2;
            const aRight = rectA.x + rectA.width / 2;
            const aTop = rectA.y - rectA.height;
            const aBottom = rectA.y;

            const bLeft = rectB.x - rectB.width / 2;
            const bRight = rectB.x + rectB.width / 2;
            const bTop = rectB.y - rectB.height;
            const bBottom = rectB.y;

            return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
        },

        deathFromEnemy(enemy) {
            for (let e of enemy) {
                if (e.isDead || this.isDead) continue;

                let enemyWithOffset = {
                    x: e.x + e.startPosX,
                    y: e.y,
                    width: e.width,
                    height: e.height
                };

                if (this.checkCollision(this, enemyWithOffset)) {
                    const enemyHeadZoneTop = enemyWithOffset.y - enemyWithOffset.height;
                    const enemyHeadZoneBottom = enemyWithOffset.y - enemyWithOffset.height + enemyWithOffset.height / 3;

                    if (this.y - this.height >= enemyHeadZoneTop && this.y - this.height <= enemyHeadZoneBottom) {
                        if (!this.isDead) {
                            this.isDead = true;
                            this.isDeadEnemy = true;
                            this.visible = true;
                            this.animationStart = millis();
                            deathSound.play();
                        }
                    } else {
                        e.isDead = true;
                        e.state = e.direction ? "deathRight" : "deathLeft";
                        e.animationStart = millis();
                    }
                }
            }
        }
    };

    //enemy = new Enemy(450, groundLevel, 400, 650);
    //enemy1 = new Enemy(750, groundLevel, 700, 800);

    ground = new Ground(0, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 8);
    canyon = new Canyon(ground.x + ground.numTiles * ground.tileSize, groundLevel, 100, groundMiddleTile.height);
    ground1 = new Ground(canyon.x + canyon.width, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 4);
    canyon1 = new Canyon(ground1.x + ground1.numTiles * ground1.tileSize, groundLevel, 0, groundMiddleTile.height);
    ground2 = new Ground(canyon1.x + canyon1.width, groundLevel, groundMiddleTile.width, groundMiddleTile.height, 2);

    platform = new Platform(150, groundLevel - 100, platformMiddleTile.width, platformMiddleTile.height, 4);
    //platform1 = new Platform(500, groundLevel - 200, platformMiddleTile.width, platformMiddleTile.height, 2);
}

function setup() {
    let cnv = createCanvas(400, 300);
    const ctx = cnv.drawingContext;
    ctx.imageSmoothingEnabled = false;
    pixelDensity(1);
    restart();
    noSmooth();
}

function gameScreen() {
    ground.update();
    ground1.update();
    ground2.update();
    canyon.update();
    canyon1.update();

    platform.update();
    //platform1.update();

    //enemy.update();
    //enemy1.update();

    if (!character.isDead) {
        character.checkCanyon([canyon, canyon1]);
    }

    character.checkPlatform([platform]);
    character.checkGround([ground, ground1, ground2]);
    character.draw();
    character.control();
    character.deathFromEnemy([/*enemy, enemy1*/]);
}

function deathScreen() {
    noStroke();
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    fill("#9c0000");
    textSize(100);
    textAlign(CENTER, CENTER);
    text("YOU DIED!", innerWidth / 2, innerHeight / 2);

    /*noFill();
    stroke(0);
    rect(innerWidth / 2 - 130, innerHeight / 2 + 80, 260, 60);*/
    fill("#ffffff");
    textSize(50);
    text("Restart?", innerWidth / 2, innerHeight / 2 + 100);
}

function winScreen() {}

function mousePressed() {
    if (mouseX >= 15 && mouseX <= 45 && mouseY >= 10 && mouseY <= 40) {
        helpIsOpened = helpIsOpened ? false : true;
    }

    if (
        (mouseX >= innerWidth / 2 - 130 &&
            mouseX <= innerWidth / 2 + 130 &&
            mouseY >= innerHeight / 2 + 80 &&
            mouseY <= innerHeight / 2 + 140 &&
            character.isDead) ||
        (settingsMenuOpened && mouseX >= 15 && mouseX <= 45 && mouseY >= 80 && mouseY <= 110)
    ) {
        gameState = "game";
        restart();
    }
    if (mouseX >= 15 && mouseX <= 45 && mouseY >= 45 && mouseY <= 75)
        if (masterVolume > 0 || storedVolume == 0) {
            storedVolume = masterVolume;
            masterVolume = 0;
        } else {
            masterVolume = storedVolume;
        }
}

function mouseOver() {
    const settingButton = mouseX >= 15 && mouseX <= 45 && mouseY >= 10 && mouseY <= 40;

    const deadRestartButton =
        mouseX >= innerWidth / 2 - 130 &&
        mouseX <= innerWidth / 2 + 130 &&
        mouseY >= innerHeight / 2 + 80 &&
        mouseY <= innerHeight / 2 + 140 &&
        character.isDead;

    const soundButton = settingsMenuOpened && mouseX >= 15 && mouseX <= 45 && mouseY >= 45 && mouseY <= 75;

    const restartButton = settingsMenuOpened && mouseX >= 15 && mouseX <= 45 && mouseY >= 80 && mouseY <= 110;


    if (settingButton || deadRestartButton || soundButton || restartButton) {
        cursor(HAND);
    } else cursor(ARROW);
}

function help() {
    fill(0);
    noStroke();
    textSize(20);
    text("mouse: " + mouseX + ", " + mouseY, 100, 20);
    text("character: " + character.x + ", " + character.y, 100, 40);
    text("enemy: " + enemy.x + ", " + enemy.y, 100, 60);
    text("leftBorder: " + enemy.leftBorder + ", rightBorder" + enemy.rightBorder, 100, 80);
    text("volume: " + masterVolume, 100, 100);
    text("Character ground level: " + character.groundLevel, 100, 300);
    text("Platform X Y: " + platform.x + " " + platform.y, 100, 400);
}

function draw() {
    image(background01, 0, 0, innerWidth, innerHeight);

    switch (gameState) {
        case "game":
            gameScreen();
            break;
        case "death":
            gameScreen();
            deathScreen();
            break;
    }

    if (helpIsOpened) help();

    //soundChange();
    settings();

    mouseOver();
}
