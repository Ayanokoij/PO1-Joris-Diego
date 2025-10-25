var JosLevens = 3;


class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null; 
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        if (rij == 0 || rij == 11 || kolom == 0 || kolom == 17) {
          fill('blue');
          rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
          if (dist(kolom*this.celGrootte,rij*this.celGrootte, mouseX, mouseY) < this.celGrootte) {
            fill('red')
            rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
          }

        }
        else {
          noFill();
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
        }
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.levens = 3;
    this.diameter = 50
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }


  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }
  wordtGeraakt(raket) {
    if (dist(this.x,this.y,raket.x,raket.y) <= (raket.diameter + this.diameter) / 2) {
      raket.y = -100;
      return true;
    }
    else {
      return false;
    }
  }
  wordtGeraakt(pingpong) {
    if (this.x == pingpong.x  && this.y == pingpong.y) {
      JosLevens +=1;
      pingpong = null;
      return true;
      
    }
    else {
      return false;
    }
  }

  toon() {
    
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class raket {
  constructor(x,y,l,vy) {
    this.diameter = 50;
    this.x = x;
    this.y = y;
    this.l = l;
    this.vy = vy;
    this.kleur = 'black';
  }

  beweeg() {

    this.y += this.vy;
    if (this.y > canvas.height - this.diameter / 2 || this.y < this.diameter / 2) {
      this.vy *= -1;
    }
    }

  teken() {
    push();
    fill(this.kleur);
    noStroke();
    ellipse(this.x,this.y,this.diameter);
    pop();
  }
}

class pingpong {
  diameter = 40;
  straal = null;
  x = null;
  y = null;
  snelheidX = 32;
  snelheidY = 20;

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
    }
  }

  teken() {
    fill('white');
    ellipse(this.x,this.y,this.diameter);
  }
}

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function RaketwordGeraakt() {
  if (dis(eve.x,eve.y,raket.x,raket.y) < (raket.diameter + eve.diameter) / 2) {
    return true;
  }
  else  {
    return false;
  }
}

function WinVerliesChecker() {


  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy) || eve.wordtGeraakt(raket1)|| eve.wordtGeraakt(raket2) || eve.wordtGeraakt(raket3) || RaketwordGeraakt()== true) {
      if (JosLevens > 1) {  
        JosLevens --;
        eve.x = 0;
        eve.y = 300;
        alice.x = 700;
        alice.y = 200;
        bob.x = 600;
        bob.y = 400;
        cindy.x = 900;
        cindy.y = 50;
      }
      else {
        background('red')
        fill('white');
        textSize(90);
        text("Je hebt verloren..", 30, 300)
        noLoop();
      }
    }


    if (eve.gehaald) {
      background('green');
      fill('white');
      textSize(90);
      text("Je hebt gewonnen!",30,300);
      noLoop();
    }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(20);

  raster = new Raster(12,18);

  raster.berekenCelGrootte();


  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(900,50);
  cindy.stapGrootte = 1*eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  raket1 = new raket(random(50,850), random(50,550), 25, 12);
  raket2 = new raket(random(50,850), random(50,550), 25, 20);
  raket3 = new raket(random(50,850), random(50,550), 25, 12);
  pingpong1 = new pingpong();
  
}

function draw() {
  background(brug);
  raster.teken();

  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
  cindy.beweeg();
  raket1.beweeg();
  raket1.teken();
  raket2.beweeg();
  raket2.teken();
  raket3.beweeg();
  raket3.teken();
  pingpong1.beweeg();
  pingpong1.teken();
  text("Levens: " + JosLevens, 10, 20)
  WinVerliesChecker();
  RaketwordGeraakt();


  
} 