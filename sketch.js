//game stage
var stage = 0;

//character
var posX = 200;
var posY = 432;
var state = charFront;

//enemy
var EnPosX = 410;
var EnPosY = 432;
var EnSizeX = 15;
var EnSizeY = 15;
var EnState = enemyRight;
var EnDotLeft = 400;
var EnDotRight = 700;
let EnDirection = 1;
var EnRand;

//moveSpeed
var moveSpeed = 7;

//gravity, jump
var jump = false;
var direction = 1;
var velocity = 2;
var jumpPower = 10;
var fallingSpeed = 5;
var minHeight = 432;
var maxHeight = 0;
var jumpCounter = 0;

function setup() {
    createCanvas(1024, 576);
}

function draw() {
    if (stage == 0) {
        game();
        cloud();
        mountain();
        tree();
        canyon();
        apple();
        EnRand = Math.floor(Math.random() * (10 - 1)) + 1;
        switch (EnState) {
            case "enemyLeft":
                enemyLeft();
                break;
            case "enemyRight":
                enemyRight();
                break;
            default:
                enemyRight();
                break;
        }

        switch (state) {
            case "charJump":
                charJump();
                break;
            case "charLeft":
                charLeft();
                break;
            case "charRight":
                charRight();
                break;
            case "charJumpLeft":
                charJumpLeft();
                break;
            case "charJumpRight":
                charJumpRight();
                break;
            default:
                charFront();
                break;
        }

        gravity();
        charControl();
        enemyMovement();
    }
    console.log(key);
    console.log(EnRand);
}

function charControl() {
    if (keyIsDown(UP_ARROW)) {
        jump = true;
        state = "charJump";
    }
    if (keyIsDown(DOWN_ARROW)) {
        state = "charFront";
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (keyIsDown(UP_ARROW)) {
            posX += moveSpeed;
            jump = true;
            state = "charJumpRight";
        } else {
            posX += moveSpeed;
            state = "charRight";
        }
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (keyIsDown(UP_ARROW)) {
            posX -= moveSpeed;
            jump = true;
            state = "charJumpLeft";
        } else {
            posX -= moveSpeed;
            state = "charLeft";
        }
    }
}

function enemyMovement() {
    EnPosX += EnRand * EnDirection;
    if (EnPosX <= EnDotLeft) {
        EnPosX += EnDotLeft - EnPosX;
        EnDirection *= -1;
        EnState = "enemyRight";
    } else if (EnPosX >= EnDotRight) {
        EnPosX -= EnPosX - EnDotRight;
        EnDirection *= -1;
        EnState = "enemyLeft";
    }
}

function gravity() {
    if (posY >= minHeight && jump == false) {
        posY = posY;
        jumpCounter = 0;
        state = "charFront";
    } else {
        posY = posY + direction * velocity;
    }

    if (jump) {
        if (posY <= maxHeight || jumpCounter >= jumpPower) {
            if (posY >= minHeight) {
                posY = minHeight;
                jump = false;
            } else {
                velocity = fallingSpeed; //fall
            }
        } else {
            velocity = -jumpPower; //jump
            jumpCounter = jumpCounter + 1;
        }
    } else {
        velocity = fallingSpeed; //fall
    }
}

function enemyLeft() {
    stroke("#000000");
    strokeWeight(2);
    fill("#5e29b1");
    rect(EnPosX - EnSizeX, EnPosY, EnSizeX * 2, EnSizeY * -2);
    fill("#ffffff");
    circle(EnPosX - EnSizeX, EnPosY - EnSizeY, 10); //left eye
}

function enemyRight() {
    stroke("#000000");
    strokeWeight(2);
    fill("#5e29b1");
    rect(EnPosX - EnSizeX, EnPosY, EnSizeX * 2, EnSizeY * -2);
    fill("#ffffff");
    circle(EnPosX + EnSizeX, EnPosY - EnSizeY, 10); //right eye
}

function charFront() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX + 15, posY - 50, 10); //right eye black
    circle(posX - 15, posY - 50, 10); //left eye black
    fill("#e2dddf");
    circle(posX + 15, posY - 50, 5); //right eye white
    circle(posX - 15, posY - 50, 5); //left eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX + 20, posY); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX - 20, posY); //left leg
}

function charRight() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX + 15, posY - 50, 10); //right eye black
    fill("#e2dddf");
    circle(posX + 15, posY - 50, 5); //right eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX + 20, posY); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX, posY); //left leg
}

function charLeft() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX - 15, posY - 50, 10); //left eye black
    fill("#e2dddf");
    circle(posX - 15, posY - 50, 5); //left eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX, posY); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX - 20, posY); //left leg
}

function charJump() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX + 15, posY - 50, 10); //right eye black
    circle(posX - 15, posY - 50, 10); //left eye black
    fill("#e2dddf");
    circle(posX + 15, posY - 50, 5); //right eye white
    circle(posX - 15, posY - 50, 5); //left eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX + 15, posY + 5); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX - 15, posY + 5); //left leg
}

function charJumpRight() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX + 15, posY - 50, 10); //right eye black
    fill("#e2dddf");
    circle(posX + 15, posY - 50, 5); //right eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX + 20, posY + 5); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX, posY + 5); //left leg
}

function charJumpLeft() {
    noStroke();
    fill("#ffc500");
    circle(posX, posY - 50, 50); //body
    fill("#000000");
    circle(posX - 15, posY - 50, 10); //left eye black
    fill("#e2dddf");
    circle(posX - 15, posY - 50, 5); //left eye white
    stroke("#ffc500");
    strokeWeight(5);
    line(posX + 10, posY - 30, posX + 10, posY);
    line(posX + 10, posY, posX, posY + 5); //right leg
    line(posX - 10, posY - 30, posX - 10, posY);
    line(posX - 10, posY, posX - 20, posY + 5); //left leg
}

function game() {
    background(100, 155, 255);

    noStroke();
    fill(0, 155, 0);
    rect(0, 432, 1024, 144); //grass
}

function cloud() {
    noStroke();
    fill(250);
    circle(500, 100, 100);
    circle(550, 90, 60);
    ellipse(520, 120, 175, 80);
}

function mountain() {
    noStroke();
    fill(100);
    triangle(600, 207, 450, 432, 750, 432);
    fill(80);
    triangle(700, 292, 600, 442, 800, 442);
}

function tree() {
    noStroke();
    fill(123, 63, 0);
    quad(865, 370, 885, 370, 895, 460, 855, 460);
    fill(0, 100, 0);
    ellipse(875, 370, 50, 80);
}

function canyon() {
    noStroke();
    fill(150);
    quad(160, 432, 200, 432, 210, 504, 170, 504);
    quad(170, 504, 210, 504, 200, 576, 160, 576);
    fill(100);
    quad(170, 432, 190, 432, 200, 504, 180, 504);
    quad(180, 504, 200, 504, 190, 576, 170, 576);
}

function apple() {
    noStroke();
    fill("#c42020");
    circle(350, 450, 50);
    fill("#3b2713");
    quad(350, 427, 360, 429, 363, 410, 355, 410);
}
