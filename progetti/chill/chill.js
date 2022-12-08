
/*

----0----
---------
-3-----1-
---------
----2----

*/

let bach, chill;
let volumeSlider, fxSlider;
let started, hard;
let lato;
let griglia;

let gravita = 0.035;
let forza = 1.0;      //        /\
let spinta = 0.5;     //     <-    ->

let giocatore;

let vite = 3;

let morti, livelli, viteP;
let morti_counter = 0, livelli_counter = 0;

let misc = 0;

class player {
  constructor(x, y, raggio, colore1, colore2) {
    this.x = x;
    this.y = y;
    this.raggio = raggio;
    this.colore1 = colore1;
    this.colore2 = colore2;

    this.velocita = [forza, 0.0];     //verticale, laterale
  }

  disegna() {
    noStroke();
    fill(this.colore1[0], this.colore1[1], this.colore1[2]);
    square(this.x - this.raggio, this.y - this.raggio, this.raggio * 2, this.raggio * 2);
    fill(this.colore2[0], this.colore2[1], this.colore2[2]);
    circle(this.x, this.y, this.raggio * 2);
  }

  premuto(direzione) {
    this.velocita[0] += forza;
    if (direzione) {
      this.velocita[1] += spinta;
    } else {
      this.velocita[1] -= spinta;
    }
    this.velocita[0] = constrain(this.velocita[0], -2 * this.raggio, 2 * this.raggio);
    this.velocita[1] = constrain(this.velocita[1], -2 * this.raggio, 2 * this.raggio);
  }

  update() {
    this.velocita[0] -= gravita;
    this.velocita[1] -= this.velocita[1] / 100;

    this.velocita[0] = constrain(this.velocita[0], -2 * this.raggio, 2 * this.raggio);
    this.velocita[1] = constrain(this.velocita[1], -2 * this.raggio, 2 * this.raggio);

    this.y -= this.velocita[0];
    this.x += this.velocita[1];
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getRaggio() {
    return this.raggio;
  }

}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    giocatore.premuto(false);
  } else if (keyCode === RIGHT_ARROW) {
    giocatore.premuto(true);
  }
}
function mousePressed() {
  if (misc == 0) {

  } else {
    if (mouseY > 0 && mouseY < height) {
      if (mouseX > 0 && mouseX < width / 2) {
        giocatore.premuto(false);
      } else if (mouseX > width / 2 && mouseX < width) {
        giocatore.premuto(true);
      }
    }
  }
}

class cella {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.muri = [true, true, true, true];

    this.vicini = [null, null, null, null];

    this.visitato = false;
  }

  setVicino(indice, vicino) {
    this.vicini[indice] = vicino;
  }

  setVisitato(val) {
    this.visitato = val;
  }
  getVisitato() {
    return this.visitato;
  }

  getVicino(index) {
    return this.vicini[index];
  }

  collega(cel) {
    var check = this.muri[this.vicini.indexOf(cel)];
    this.muri[this.vicini.indexOf(cel)] = false;
    if (check) {
      cel.collega(this);
    }
  }

  disegna(verde) {
    if (verde) {
      stroke(0, 255, 0);
      fill(0, 255, 0);
    } else {
      stroke(255, 0, 0);
      fill(255, 0, 0);
    }
    strokeWeight(2);
    if (this.muri[0]) {
      line(this.x * lato, this.y * lato, (this.x + 1) * lato, this.y * lato);
    }
    if (this.muri[1]) {
      line((this.x + 1) * lato, this.y * lato, (this.x + 1) * lato, (this.y + 1) * lato);
    }
    if (this.muri[2]) {
      line(this.x * lato, (this.y + 1) * lato, (this.x + 1) * lato, (this.y + 1) * lato);
    }
    if (this.muri[3]) {
      line(this.x * lato, this.y * lato, this.x * lato, (this.y + 1) * lato);
    }
  }

  getMuri() {
    return this.muri;
  }

  getMuro(index) {
    return this.muri[index];
  }
}

function setup() {
  const c = createCanvas(1, 1);
  c.parent('canvas');
  started = false;
}

function generaLabirinto() {
  /*creazione labirinto*/
  /*creazione celle*/
  griglia = [];
  for (i = 0; i < altezza; i++) {
    griglia.push([]);
    for (j = 0; j < larghezza; j++) {
      griglia[i].push(new cella(j, i));
    }
  }
  /*impostazione vicini*/
  for (i = 0; i < altezza; i++) {
    for (j = 0; j < larghezza; j++) {
      if (i > 0) {
        griglia[i][j].setVicino(0, griglia[i - 1][j]);
      }
      if (j < larghezza - 1) {
        griglia[i][j].setVicino(1, griglia[i][j + 1]);
      }
      if (i < altezza - 1) {
        griglia[i][j].setVicino(2, griglia[i + 1][j]);
      }
      if (j > 0) {
        griglia[i][j].setVicino(3, griglia[i][j - 1]);
      }
    }
  }

  griglia[parseInt(altezza / 2)][parseInt(larghezza / 2)].setVisitato(true);    //1     //inizia dal centro
  var stack = [griglia[parseInt(altezza / 2)][parseInt(larghezza / 2)]];
  while (stack.length > 0) {
    current = stack.pop();
    viciniNonVisitati = [];
    for (i = 0; i < 4; i++) {
      vicino = current.getVicino(i);
      if (vicino != null) {
        if (!vicino.getVisitato()) {
          viciniNonVisitati.push(vicino);
        }
      }
    }


    if (viciniNonVisitati.length > 0) {
      stack.push(current);
      prossimo = viciniNonVisitati[Math.floor(Math.random() * viciniNonVisitati.length)];
      current.collega(prossimo);
      prossimo.setVisitato(true);
      stack.push(prossimo);
    }
  }
}

function inizia() {
  const urlParams = new URLSearchParams(window.location.search);
  volumeSlider = document.getElementById('musica')
  fxSlider = document.getElementById('effetti')

  larghezza = urlParams.get('larghezza') || 10;
  altezza = urlParams.get('altezza') || 10;
  lato = urlParams.get('lato') || 50;
  resizeCanvas(larghezza * lato, altezza * lato);

  hard = urlParams.get('hard') ? (urlParams.get('larghezza') == 'on') : false;

  /*creazione labirinto*/
  generaLabirinto();

  giocatore = new player(lato / 2, height - (lato / 2), 4, [255, 255, 255], [242, 0, 204]);
  giocatore.velocita[1] = 0.0;
  started = true;

  //  bach = loadSound("assets/Bach.mp3", loaded);
  //  chill = loadSound("assets/Chill.wav");

  morti = document.getElementById('morti')
  livelli = document.getElementById('livello');

  if (hard) {
    viteP = document.getElementById('vite')
    viteP.innerHTML = "VITE: 3";
  }
  misc++;
}

/*function loaded() {
  bach.loop();
}*/

function draw() {
  background(0);

  if (bach != null) {
    bach.setVolume(volumeSlider.value);
  }
  if (chill != null) {
    chill.setVolume(fxSlider.value);
  }

  if (!started) {
    background(255);
  } else if (vite > 0) {

    var r = giocatore.getRaggio();
    var x = giocatore.getX();
    var y = giocatore.getY();
    var cel = griglia[Math.floor(y / lato)][Math.floor(x / lato)];

    var xRel = x - (cel.x * lato);
    var yRel = y - (cel.y * lato);

    /*game*/

    /*disegna muri*/
    for (i = 0; i < altezza; i++) {
      for (j = 0; j < larghezza; j++) {
        griglia[i][j].disegna(false);
      }
    }

    /*disegna goal*/
    fill(0, 255, 0);
    noStroke();
    strokeWeight(1);
    rect((larghezza - 1) * lato + (lato / 4), (lato / 4), lato / 2, lato / 2);


    /*gestisci giocatore*/
    giocatore.disegna();
    giocatore.update();


    /*controlla morte*/
    if (x < r || x > width - r || y < r || y > height - r) {     //muri esterni
      morte();
    } else {                                                                                          //muri interni
      //cel.disegna(true);
      if (cel.getMuro(0) && yRel < r) {
        morte()
      }
      if (cel.getMuro(1) && xRel > lato - r) {
        morte()
      }
      if (cel.getMuro(2) && yRel > lato - r) {
        morte()
      }
      if (cel.getMuro(3) && xRel < r) {
        morte()
      }
    }

    /*controlla vittoria*/
    if (cel == griglia[0][larghezza - 1]) {
      if (yRel + r >= lato / 4 && yRel - r <= 3 * (lato / 4) && xRel + r > lato / 4 && xRel - r <= 3 * (lato / 4)) {
        vittoria();
      }
    }

  } else {
    fill(255);
    stroke(255);
    text("U DEAD BRO", width / 2, height / 2);
  }


}

function morte() {
  if (chill != null && chill != undefined) {
    try {
      chill.play();
    } catch (err) { }
  }
  riposiziona();
  if (hard) {
    vite--;
    viteP.html("VITE: " + vite.toString());
  }
  morti_counter++;
  morti.html("MORTI: " + morti_counter.toString());
}
function riposiziona() {
  giocatore = new player(lato / 2, height - (lato / 2), 4, [255, 255, 255], [242, 0, 204]);
}
function vittoria() {
  generaLabirinto();
  riposiziona();
  livelli_counter++;
  livelli.html("LIVELLO: " + livelli_counter.toString());
  if (hard) {
    if (livelli_counter % 3 == 0) {
      vite++;
      viteP.html("VITE: " + vite.toString());
    }
  }
}

window.onload = inizia;