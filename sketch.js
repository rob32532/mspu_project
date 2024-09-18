/*

The Game Project

1 - Background Scenery

Use p5 drawing functions such as rect, ellipse, line, triangle and
point to draw the scenery as set out in the code comments. The items
should appear next to the text titles.

Each bit of scenery is worth two marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = you've used several shape functions to create the scenery

I've given titles and chosen some base colours, but feel free to
imaginatively modify these and interpret the scenery titles loosely to
match your game theme.


WARNING: Do not get too carried away. If you're shape takes more than 5 lines
of code to draw then you've probably over done it.


*/

function setup() {
    createCanvas(1024, 576);
}

function draw() {
    background(100, 155, 255); //fill the sky blue

    noStroke();
    fill(0, 155, 0);
    rect(0, 432, 1024, 144); //draw some green ground

    //1. a cloud in the sky
    //... add your code here

    noStroke();
    fill(250);
    circle(500, 100, 100);
    circle(550, 90, 60);
    ellipse(520, 120, 175, 80);

    //2. a mountain in the distance
    //... add your code here

    noStroke();
    fill(100);
    triangle(600, 207, 450, 432, 750, 432);
    fill(80);
    triangle(700, 292, 600, 442, 800, 442);

    //3. a tree
    //... add your code here

    noStroke();
    fill(123, 63, 0);
    quad(865, 370, 885, 370, 895, 460, 855, 460);
    fill(0, 100, 0);
    ellipse(875, 370, 50, 80);

    //4. a canyon
    //NB. the canyon should go from ground-level to the bottom of the screen

    //... add your code here

    noStroke();
    fill(150);
    quad(160, 432, 200, 432, 210, 504, 170, 504);
	quad(170, 504, 210, 504, 200, 576, 160, 576);
	fill(100);
	quad(170, 432, 190, 432, 200, 504, 180, 504);
	quad(180, 504, 200, 504, 190, 576, 170, 576);

    //5. a collectable token - eg. a jewel, fruit, coins
    //... add your code here

    noStroke();
	fill('#c42020');
	circle(350, 450, 50);
	fill('#3b2713');
	quad(350, 427, 360, 429, 363, 410, 355, 410);
}
