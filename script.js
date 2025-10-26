// Aantal levens Speler
var JosLevens = 3;

// variabelen voor piramide
var aantalLagen = 12;
var breedte;
var hoogte;

// Het maken van het Raster
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

    // Ervoor zorgen dat er een blauwe rand is en als je het raakt dat het rood wordt. 
    for (var rij = 0;rij < this.aantalRijen;rij++) {
          for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
            
            if (rij == 0 || rij == 11 || kolom == 0 || kolom == 17) {

              // als de cel een deel van de rand is wordt deze blauw.
              
              fill('blue');
              rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);

              // als de muis over de cel gaat wordt deze rood.
              if (dist(kolom*this.celGrootte,rij*this.celGrootte, mouseX, mouseY) < this.celGrootte) {
                
                fill('red')
                rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
              }
              // als een cel niet deel uitmaakt van de rand krijgt deze geen vulling/kleur.
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


// EINDE raster

// Speler
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


// Als hij wordt geraakt door een ander bewegend object
  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }
// checkt of jos een raket raakt
  wordtGeraakt(raket) {
    if (dist(raket.x, raket.y, this.x, this.y) < 50) {
      return true;
    }
    else {
      return false;
    }

  }
// Checkt of jost de pingpongbal raakt
  wordtGeraakt(pingpong) {
    if (dist(pingpong.x, pingpong.y, this.x, this.y) < 40) {
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
// EINDE speler

// Raketten aanmaken
class raket {
  constructor(x,y,vy) {
    this.diameter = 50;
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.kleur = 'black';
  }

  beweeg() {
    this.y += this.vy;
    if (this.y > canvas.height - this.diameter / 2 || this.y < this.diameter / 2) {
      this.vy *= -1;
      // de raket klapt om als hij de rand raakt

      //De raket wordt een klein stukje verplaatst als hij de rand raakt, zodat hij niet in de rand blijft hangen.
      this.y -= 1;
    }
    if (this.y < 25){
      this.vy *= 1.25;
      // de raket versnelt telkens met 1.25 als deze naar beneden gaat
    }
    if(this.y > canvas.height - this.diameter / 2){
        this.vy /= 1.25;
      // de raket remt telkens af met 1.25 als deze naar boven gaat
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

// EINDE raketten

// pingpong aanmaken
class pingpong {
  diameter = 40;
  straal = null;
  x = 25 + int(random(1,16)) * 50;
  y = 25 + int(random(1,8)) * 50;
  snelheidX = 32;
  snelheidY = 20;

  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;
// de snelheid van de bal klapt om als hij de rand raakt. Dit geld voor bijde x en y waardes.
    if (this.x < this.straal || this.x > canvas.width - this.straal) {
      this.snelheidX *= -1;
    }
    if (this.y < this.straal || this.y > canvas.height - this.straal) {
      this.snelheidY *= -1;
    }
  }
// tekenen pingpongbal
  teken() {
    fill('white');
    ellipse(this.x,this.y,this.diameter);
  }
}

// EINDE pingpong

// Vijanden aanmaken
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

// EINDE vijanden

// Begin van het spel
function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {

  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(20);
// bepaalt hoeveel rijen en kolommen er zijn
  raster = new Raster(12,18);
// functie aanroepen
  raster.berekenCelGrootte();

  // bepalen hoe groot de piramide is per vakje
  breedte = 50;
  hoogte = 25;
  
// Speler aanmaken
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }
// vijanden aanmaken
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(900,50);
  cindy.stapGrootte = 1*eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  raket1 = new raket(25 + int(random(1,16)) * 50,25 + int(random(1,8)) * 50,random(10,18));
  raket2 = new raket(25 + int(random(1,16)) * 50, 25 + int(random(1,8)) * 50, random(10,18));
  raket3 = new raket(25 + int(random(1,16)) * 50, 25 + int(random(1,8)) * 50, random(10,18));
  
  pingpong1 = new pingpong(25 + int(random(1,16)) * 50, 25 + int(random(1,8)) * 50);
}

// EINDE  objcten aanmaken

// Speler raakt een object + einde/doorloop spel/finish game.

// tekenen van de omgekeerdepiramide
/*
function tekenPiramide(n) {
  push();
  fill('red');
  if (n>0) {
    for (var nr = 1;nr < n;nr++) {
      rect(nr*breedte,0,breedte,hoogte);
    }
    
     translate(breedte/2,hoogte);
    n--;
    tekenPiramide(n);
    pop();
    
  }
}
*/
function WinOfVerlies() {

  // checkt of deze gebeurtenissen plaatsvinden
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy) || eve.wordtGeraakt(raket1) || eve.wordtGeraakt(raket2) || eve.wordtGeraakt(raket3))
    {
      //  als Jos nog levens heeft, dan gaat hij terug naar de startpositie en verliest 1 leven
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
        // als Jos geen levens meer heeft, dan is het spel afgelopen
      else {
        background('red')
        fill('white');
        textSize(90);
        text("Je hebt verloren..", 30, 300)
        noLoop();
      }
    }
  // als Jos de finish bereikt, dan heb je gewonnen
  if (eve.gehaald) {
    background('green');
    fill('white');
    textSize(90);
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }
}
  // Deze functie geeft je een extra elven als de pingpongbal aanraakt. Ook verdwijnt de pingpongbal van het speelveld.
  function ExtraLeven() {
    if ( eve.wordtGeraakt(pingpong1))
      {
        JosLevens ++;
        pingpong1.x = 1000;
        }
  }

// EINDE Speler raakt een object + einde/doorloop spel/finish game.

// alles tekenen
function draw() {
  background(brug);
  /*
  tekenPiramide(aantalLagen);
  */
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

  // laat levens zien
  
  text("Levens: " + JosLevens, 10, 20)

  // functies aanroepen
  WinOfVerlies();
  ExtraLeven();

  // EINDE alles tekenen
} 