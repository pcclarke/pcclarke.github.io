color[][] colours;
int bgH, bgS, bgB;

void setup() {
 size(600, 600);
 
 noStroke();
 rectMode(CORNER);
 noLoop();
 
 colours = new int[100][100];
 colorMode(HSB, 100);
 
 // Set up background
 bgH = int(random(100));
 bgS = int(random(20)) + 80;
 bgB = 20;
 for (int i = 0; i < 100; i++) {
   for (int j = 0; j < 100; j++) {
     colours[i][j] = color(bgH, bgS, bgB + (j/2 - 20));
   }
 }
 
 int gravity = 2;
 color growColour = color(constrain(random(20) - 10 + bgH, 0 , 100), random(20) + 80, bgB + 10);
 
 for (int i = 0; i < 8; i++) {
   int rootX = int(random(100));
   int rootY = int(random(20));
   colours[rootX][rootY] = growColour;
   
   for (int j = 0; j < random(5); j++) {
     int spreadX = rootX;
     int spreadY = rootY;
     
     int n = 0;
     while(spreadX != 0 && spreadX != 99 && spreadY != 0 && spreadY != 99 && n < 400) {
       int direction = gravity;
       
       if (random(100) < 75) {
         direction = int(random(4));
       }
       
       if (direction == 0) {
         spreadY--;
       } else if (direction == 1) {
         spreadX++;
       } else if (direction == 2) {
         spreadY++;
       } else if (direction == 3) {
         spreadX--;
       }
       
       color spreadColour = color(constrain(random(20) - 10 + bgH, 0 , 100), random(20) + 80, bgB + 10);
       colours[spreadX][spreadY] = spreadColour;
       
       n++;
     }
   }
 }
}

void draw() {
  for(int i = 0; i < 100; i++) {
    for (int j = 0; j < 100; j++) {
      fill(colours[i][j]);
      rect((i * width/100), (j * height/100), (width/100), (height/100));
      fill(bgH, bgS , bgB+ random(10), random(20) + 40);
      rect((i * width/100) + random(width/100), (j * height/100), (width/100), (height/100));
    }
  }
}
