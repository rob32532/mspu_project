function setup() {
    createCanvas(1024, 576);
}

function draw() {
    background(100, 155, 255);

    noStroke();
    fill(0, 155, 0);
    rect(0, 432, 1024, 144); //grass

    noStroke(); 
    fill(250);
    circle(500, 100, 100);
    circle(550, 90, 60);
    ellipse(520, 120, 175, 80); //cloud

    noStroke();
    fill(100);
    triangle(600, 207, 450, 432, 750, 432);
    fill(80);
    triangle(700, 292, 600, 442, 800, 442); //mountain

    noStroke();
    fill(123, 63, 0);
    quad(865, 370, 885, 370, 895, 460, 855, 460);
    fill(0, 100, 0);
    ellipse(875, 370, 50, 80); //tree

    noStroke();
    fill(150);
    quad(160, 432, 200, 432, 210, 504, 170, 504);
	quad(170, 504, 210, 504, 200, 576, 160, 576);
	fill(100);
	quad(170, 432, 190, 432, 200, 504, 180, 504);
	quad(180, 504, 200, 504, 190, 576, 170, 576); //canyon

    noStroke();
	fill('#c42020');
	circle(350, 450, 50);
	fill('#3b2713');
	quad(350, 427, 360, 429, 363, 410, 355, 410); //apple
}