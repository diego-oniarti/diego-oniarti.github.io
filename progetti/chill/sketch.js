const stati = {
    idle:0,
    countdown:1,
    play:2,
    end:3
}
let stato = stati.idle;

const div = document.getElementById('canvas');
let countdown_start;

let map_drawing;

const jumpForceUp = 1;
const jumpForceSide=0.5;
const gravity = 0.035;

const game = {
    map: [],
    score: 0, 
    size: 9,
    lives: 3,
    level: 1,
};
const player = {
    pos: undefined, 
    vel: undefined, 
}

function setup() {
    const lato = Math.min(600,div.parentElement.parentElement.clientWidth);
    const canvas = createCanvas(lato,lato);
    canvas.parent(div);
    resizeCollapsable();

    player.pos = createVector(0,0);
    player.vel = createVector(0,0);
}

function draw() {
    switch (stato) {
        case stati.idle:
            background(50);
            textSize(width/10);
            textAlign(CENTER,CENTER);
            noStroke();
            fill(255);
            text("A/D per iniziare",width/2,height/2);
            break;
        case stati.countdown:
            background(50);
            noFill();
            stroke(255);
            strokeWeight(20);
            circle(width/2,height/2,width*0.7);
            const t = (new Date()-countdown_start)/1000; // t in secondi
            if (parseInt(t)%2==0)
                arc(width/2,height/2,width*0.7-60,height*0.7-60, 0-PI/2,t*TWO_PI-PI/2);
            else
                arc(width/2,height/2,width*0.7-60,height*0.7-60,t*TWO_PI-PI/2,0-PI/2);

            textSize(width/5);
            textAlign(CENTER,CENTER);
            fill(255);
            noStroke();
            text(3-parseInt(t), width/2,height/2);

            if (t>=3) {
                stato = stati.play;
            }
            break;
        case stati.play:
            const old_cell_size = 50;

            // disegna lo sfondo
            image(map_drawing,0,0)

            // disegna il giocatore
            stroke(255);
            strokeWeight(1);
            fill(242, 0, 204);
            const scale = 10/game.size * width/500;
            circle(player.pos.x*scale, player.pos.y * scale, 8 * scale);

            //simula fisica
            updatePlayer();

            //check muri
            const x_cella = floor(player.pos.x/old_cell_size);
            const y_cella = floor(player.pos.y/old_cell_size);
            if (y_cella>=game.size || y_cella<0 || x_cella>=game.size || x_cella<0) {
                die()
            }else{
                const cella = game.map[y_cella][x_cella];
                if (cella.muri[0] && player.pos.y-8 <= y_cella*old_cell_size 
                    || cella.muri[1] && player.pos.x+8 >= (x_cella+1)*old_cell_size
                    || cella.muri[2] && player.pos.y+8 >= (y_cella+1)*old_cell_size
                    || cella.muri[3] && player.pos.x-8 <= x_cella*old_cell_size) {
                    die();
                }
            }

            //check win
            if (   (player.pos.x+8>old_cell_size*(game.size-0.8))
                && (player.pos.y+8>old_cell_size*0.2)
                && (player.pos.x-8<old_cell_size*(game.size-0.2)) 
                && (player.pos.y-8<old_cell_size*0.8)) {
                win();
            }

            break;
        case stati.end:
            background(50);
            textSize(width/10);
            fill(256);
            noStroke();
            textAlign(CENTER, CENTER);
            text(`Hai Perso\nPunteggio: ${game.score}\nLivello: ${game.level}`, width/2,height/2);
            break;
    }
}

function keyPressed() {
    switch (stato){
    case stati.idle:
        if (["a","d","ArrowLeft","ArrowRight"].includes(key)) {
            stato=stati.countdown;
            countdown_start = new Date();
            newLevel();
            return false;
        }
        break;
    case stati.play:
        if (["a","ArrowLeft"].includes(key)) {
            jumpLeft();
            return false;
        }
        if (["d","ArrowRight"].includes(key)) {
            jumpRight();
            return false;
        }
        break;
    case stati.end:
        if (["a","d","ArrowLeft","ArrowRight"].includes(key)) {
            restart();
            return false;
        }
        break;
    }
}
function mousePressed() {
    if (mouseX<0 || mouseY<0 || mouseX>width || mouseY>height) {
        return true;
    }
    switch (stato) {
        case stati.idle:
            stato=stati.countdown;
            countdown_start = new Date();
            newLevel();
            return false;
        case stati.play:
            if (mouseX<width/2) {
                jumpLeft();
            }else{
                jumpRight();
            }
            return false;
        case stati.end:
            restart();
            return false;
    }
}
function restart() {
    game.score= 0, 
    game.size= 9,
    game.lives= 3,
    game.level= 1,
    updateScoreboard();
    
    stato=stati.countdown;
    countdown_start = new Date();

    newLevel();
}
function jumpLeft() {
    player.vel.y += jumpForceUp;
    player.vel.x -= jumpForceSide;
}
function jumpRight() {
    player.vel.y += jumpForceUp;
    player.vel.x += jumpForceSide;
}

function win() {
    game.score += 10;
    game.level += 1;
    if (game.level%3==0) {
        game.lives+=1;
    }
    countdown_start = new Date();
    stato=stati.countdown;
    updateScoreboard();
    newLevel();
}
function updateScoreboard() {
    document.getElementById('score').value=game.score;
}

function die() {
    resetPlayer();
    game.lives--;
    document.getElementById("lives").value=game.lives;
    if (game.lives==0) {
        stato=stati.end;
    }
}

function updatePlayer() {
    const dt = 80/frameRate();

    player.vel.y -= gravity *dt;
    player.vel.x *= 0.99 ;
    player.pos.y -= player.vel.y *dt;
    player.pos.x += player.vel.x *dt;
}

function newLevel() {
    game.size++;
    game.map = getMaze(game.size);
    drawMap();
    resetPlayer();
}
function drawMap() {
    map_drawing = createGraphics(width,height);
    map_drawing.background(50);
    const cell_size = width/game.size;

    //disegna i muri
    map_drawing.strokeWeight(2);
    map_drawing.stroke(255,0,0);
    for (let y=0; y<game.size; y++) {
        for (let x=0; x<game.size; x++) {
            if (game.map[y][x].muri[0]) {
                map_drawing.line(x*cell_size, y*cell_size, (x+1)*cell_size, y*cell_size);
            }
            if (game.map[y][x].muri[3]) {
                map_drawing.line(x*cell_size, y*cell_size, x*cell_size, (y+1)*cell_size);
            }
        }
    }
    map_drawing.line(width,0,width,height);
    map_drawing.line(0,height,width,height);

    // disegna il traguardo
    map_drawing.noStroke();
    map_drawing.fill(0,255,0);
    map_drawing.rect(width-cell_size*0.8,cell_size*0.2, cell_size*0.6,cell_size*0.6);
}
function resetPlayer() {
    const cell_size=50;
    player.pos = createVector(cell_size/2,cell_size*(game.size-0.5));
    player.vel = createVector(0,jumpForceUp);
}

function getMaze(n) {
    randomSeed(n);
    const celle = [];
    for (let i=0; i<n; i++) {
        celle.push([]);
        for (let j=0; j<n; j++) {
            celle[i].push({
                visitato: false,
                muri: [true,true,true,true],
                x:j,y:i,
            });
        }
    }
    
    const stack = [];
    celle[0][0].visitato = true;
    stack.push(celle[0][0]);
    while (stack.length>0) {
        const corrente = stack.pop();
        const vicini = [0,1,2,3].map(d=>{
            const y = corrente.y + [-1,0,1,0][d];
            const x = corrente.x + [0,1,0,-1][d];
            if (x>=0 && y>=0 && x<n && y<n && celle[y][x].visitato===false) {
                return {
                    cella: celle[y][x],
                    dir: d
                };
            }
            return null;
        }).filter(a=>a);
        if (vicini.length>0) {
            stack.push(corrente);
            const prossimo = vicini[Math.floor(random()*vicini.length)]
            prossimo.cella.visitato=true;
            corrente.muri[prossimo.dir] = false;
            prossimo.cella.muri[(prossimo.dir+2)%4] = false;
            stack.push(prossimo.cella)
        }
    }

    return celle;
}

function windowResized() {
    let lato = Math.min(600, div.parentElement.parentElement.clientWidth);
    resizeCanvas(lato,lato,false);
}