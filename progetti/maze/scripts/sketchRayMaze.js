let maze, player;
let checkBox, showMap = false, firstShow = true;
let gameStarted = false, gameStartTime;

let checkBoxColore;

let coloreCielo;
let colorePavimento;
let coloreScritta;

function setup() {
  setColori(false);
  createCanvas(900, 450);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const seed = urlParams.get("seed");
  const righe = urlParams.get("rows") || 10;
  const colonne = urlParams.get("cols") || 10;
  console.log(seed || "seed non trovato");

  maze = new Maze(Math.floor(righe), Math.floor(colonne), width / 2, height, seed);
  player = new Player(10, 10, maze.lines, righe / 10);

  strokeCap(PROJECT);
  textStyle(BOLD);

  checkBox = createCheckbox('ShowMap', false);
  checkBox.changed(() => {
    if (firstShow) {
      if (confirm("Turn on map? It will make the game boring AF")) {
        showMap = checkBox.checked();
        firstShow = false;
      } else {
        checkBox.checked(false)
        return false;
      }
    } else {
      showMap = checkBox.checked();
    }
  });

  checkBoxColore = createCheckbox('Colors', false);
  checkBoxColore.changed(() => {
    setColori(checkBoxColore.checked());
  });
}

function draw() {
  background(30);
  fill(colorePavimento)
  rect(0,height/2,width/2,height/2);
  fill(coloreCielo)
  rect(0,0,width/2,height/2);

  noStroke();
  fill(240)
  player.update();
  player.draw(width / 2, 0);
  player.drawView(0, 0);

  if (!showMap) {
    fill(255)
    stroke(255)
    rect(width / 2, 0, width / 2, height)
  }else{
    strokeWeight(2);
    stroke(240);
    maze.draw(width/2,0);
  }

  let time = performance.now();
  let seconds = (time - gameStartTime) / 1000;
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  let stringTime;
  if (mins >= 60) {
    let hours = Math.floor(mins / 60);
    mins %= 60;
    stringTime = (hours).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (mins).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (secs).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

  } else {
    stringTime = (mins).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + (secs).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  }

  fill(0, 187, 0);
  noStroke();
  fill(coloreScritta);
  textSize(15);
  if (gameStarted && firstShow) text(stringTime, 0, 15);


  if (player.vittoria) {
    background(30);
    strokeWeight(2);
    stroke(240);
    maze.draw(width / 2, 0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    fill(0, 255, 0)
    text("YOU WON", width / 4, height / 2);
    if (firstShow) text(stringTime, width / 4, height / 2 + 25);

    noLoop();
  }
}

function keyPressed() {
  if (key == 'w' || key == 'W' || keyCode == UP_ARROW) player.tasti.w = true;
  if (key == 'a' || key == 'A' || keyCode == LEFT_ARROW) player.tasti.a = true;
  if (key == 's' || key == 'S' || keyCode == DOWN_ARROW) player.tasti.s = true;
  if (key == 'd' || key == 'D' || keyCode == RIGHT_ARROW) player.tasti.d = true;
  if (!gameStarted) {
    gameStarted = true;
    gameStartTime = performance.now();
  }
  return false;
}

function keyReleased() {
  if (key == 'w' || key == 'W' || keyCode == UP_ARROW) player.tasti.w = false;
  if (key == 'a' || key == 'A' || keyCode == LEFT_ARROW) player.tasti.a = false;
  if (key == 's' || key == 'S' || keyCode == DOWN_ARROW) player.tasti.s = false;
  if (key == 'd' || key == 'D' || keyCode == RIGHT_ARROW) player.tasti.d = false;
  return false;
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
});

function setColori(val){
  if (val){
    coloreCielo=    color(150, 184, 235)
    colorePavimento=color(48, 150, 75)
    coloreScritta  =color(0);
  }else{
    coloreCielo=    color(30)
    colorePavimento=color(30)
    coloreScritta  =color(0,187,0);
  }
}