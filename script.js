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

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class raket {
  constructor(x,y,vy,vx) {
    this.diameter = 50;
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.vx = vx;
    this.kleur = 'deeppink';
  }

  beweeg() {
    this.x += this.vx;
    if (this.x > canvas.width - this.diameter / 2 || this.x < canvas.width / 3 + this.diameter / 2) {
      this.vx *= -1;
    }
    this.y += this.vy;
    if (this.y > canvas.height - this.diameter / 2 || this.y < this.diameter / 2) {
      this.vy *= -1;
    }
  }

  wordtGeraakt(k) {
    if (dist(this.x,this.y,k.x,k.y) <= (k.diameter + this.diameter) / 2) {
      k.y = -100;
      this.levens++;
    }
  }

  teken() {
    push();
    fill(this.kleur);
    noStroke();
    ellipse(this.x,this.y,this.diameter);
    fill('white');
    text(this.levens,this.x,this.y);
    pop();
  }
}

class pingpong {
  constructor() {
    this.diameter = 20;
    this.straal = this.diameter/2;
    this.x = random(2*this.straal,canvas.width - 2*this.straal);
    this.y = this.straal;
    this.basissnelheid = 5;
    this.snelheidX = random(1,this.basissnelheid);
    this.snelheidY = random(1,this.basissnelheid);
    this.kleur = 0;
  }  

  beweeg() {
    this.x+=this.snelheidX;
    this.y+=this.snelheidY;
  }

  teken() {
    fill(this.kleur);
    ellipse(this.x,this.y,this.diameter);
  }
}

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrote = null;
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

  raket1 = new raket(250, 200, 10, 0);
  raket2 = new raket(500, 200, 10, 0)
  raket3 = new raket(100, 200, 10, 0)
  Tennisbal = new Tennisbal()
  
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
  pingpong.beweeg();
  pingpong.teken();
  text("Levens: " + JosLevens, 10, 20)



  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    if (JosLevens > 1) {  
      JosLevens--;
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