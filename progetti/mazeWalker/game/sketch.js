const game_div = document.getElementById('game_div');
const map_div = document.getElementById('map_div');

const N = 10;
const SPEED = 0.03;
const FOV = Math.PI/3;
const N_RAYS = 100;
let maze, player, walls;

new p5(p=>{
    p.stati = {idle:0, game:1, ended:2};
    p.stato = p.stati.idle;

    p.setup = ()=>{
        const lato = game_div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.class('bordered')
        canvas.parent('game_div');
        resizeCollapsable();
        
        // crea il player
        player = {
            pos: p.createVector(0.5, 0.5),
            dir: 0,
            keys: {w:false,a:false,s:false,d:false},
            rays: [],
        };

        // crea il labirinto
        calcMaze(p); 
    }
    p.draw = ()=>{
        switch (p.stato) {
            case p.stati.idle:
                p.background(50);
                p.fill(255);
                p.noStroke();
                p.textAlign(p.CENTER,p.CENTER);
                p.textSize(p.width/20);
                p.text("use WASD or the arrow keys to move.\nExplore the maze and find the green tile",p.width/2,p.height/2);
                break;
            case p.stati.game:
                const band_width = p.width/N_RAYS;

                p.background(50);
        
                p.noStroke();
                player.rays = [];
                for (let i=0; i<N_RAYS; i++) {
                    const angolo = player.dir + p.map(i,0,100,-FOV/2,FOV/2);
                    const ray = cast_ray(angolo);
                    player.rays.push(ray);
        
                    const d = Math.cos( angolo-player.dir ) * ray.dist * 1.5;
                    const dd = Math.pow(d,1/2);
                    
                    let col = ray.wall.game_color;
                    p.fill(col.levels[0]/dd, col.levels[1]/dd, col.levels[2]/dd);
                    const h = p.height/3*2/d;
                    p.rect(i*band_width, (p.height-h)/2, band_width+1, h);
                }
       
                if (map.stato==map.stati.hidden) {
                    const time = (new Date() - p.startTime) / 1000;
                    p.noStroke();
                    p.fill(255,0,0);
                    p.textAlign(p.LEFT);
                    p.textSize(20);
                    p.text(`${
                        Math.floor(time/60).toString().padStart(2,'0')
                    }:${
                        Math.floor(time%60).toString().padStart(2,'0')
                    }`,0,20);
                }

                //update player
                const check = [-p.PI/2,0,p.PI/2,p.PI].map(ang=>{
                    return cast_ray(ang);
                });
                const box = [check[0].y+0.01, check[1].x-0.01, check[2].y-0.01, check[3].x+0.01];
                if (player.keys.w) {
                    player.pos.add(p5.Vector.fromAngle(player.dir, SPEED));
                }
                if (player.keys.s) {
                    player.pos.sub(p5.Vector.fromAngle(player.dir, SPEED));
                }
                player.pos.x = p.constrain(player.pos.x, box[3],box[1]);
                player.pos.y = p.constrain(player.pos.y, box[0],box[2]);
        
                if (player.keys.a) {
                    player.dir -= p.PI/40;
                }
                if (player.keys.d) {
                    player.dir += p.PI/40;
                }

                if (player.pos.x>N-0.8&&player.pos.x<N-0.2&&player.pos.y>N-0.8&&player.pos.y<N-0.2) {
                    p.endTime=new Date();
                    p.stato = p.stati.ended;
                    p.old_map_state = map.stato;
                    map.stato=map.stati.shown;
                }
                break;
            case p.stati.ended:
                const time_s=(p.endTime-p.startTime)/1000;
                p.background(50);
                p.fill(255);
                p.noStroke();
                p.textAlign(p.CENTER,p.CENTER);
                p.textSize(p.width/20);
                if (p.old_map_state==map.stati.hidden) {
                    p.text(`You Won!\nTime: ${
                        Math.floor(time_s/60).toString().padStart(2,'0')
                    }:${
                        Math.floor(time_s%60).toString().padStart(2,'0')
                    }`,p.width/2,p.height/2);
                }else{
                    p.text("You Won!",p.width/2,p.height/2);
                }
                break;
        }
    }


    p.keyPressed = ()=>{
        if ((p.stato==p.stati.idle || p.stato==p.stati.ended) && ["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(p.key)) {
            if (p.stato==p.stati.ended) {
                calcMaze(p);
                player = {
                    pos: p.createVector(0.5, 0.5),
                    dir: 0,
                    keys: {w:false,a:false,s:false,d:false},
                    rays: [],
                };
                map.stato=map.stati.hidden;
            }
            p.stato=p.stati.game;
            p.startTime=new Date();
        }
        if(["w","ArrowUp"].includes(p.key)) {
            player.keys.w=true;
            return false;
        }
        if(["a","ArrowLeft"].includes(p.key)) {
            player.keys.a=true;
            return false;
        }
        if(["s","ArrowDown"].includes(p.key)) {
            player.keys.s=true;
            return false;
        }
        if(["d","ArrowRight"].includes(p.key)) {
            player.keys.d=true;
            return false;
        }

        return true;
    }
    p.keyReleased = ()=>{
        if(["w","ArrowUp"].includes(p.key)) {
            player.keys.w=false;
            return false;
        }
        if(["a","ArrowLeft"].includes(p.key)) {
            player.keys.a=false;
            return false;
        }
        if(["s","ArrowDown"].includes(p.key)) {
            player.keys.s=false;
            return false;
        }
        if(["d","ArrowRight"].includes(p.key)) {
            player.keys.d=false;
            return false;
        }
    }
    p.windowResized = ()=>{
        const lato = game_div.clientWidth;
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});




// mappa
const map = new p5(p=>{
    p.stati = {hidden:0, shown:1}; 
    p.stato = p.stati.hidden;

    p.setup = ()=>{
        const lato = map_div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.class('bordered')
        canvas.parent('map_div');
        resizeCollapsable();
    }
    p.draw = ()=>{
        if (!maze) return;
        switch (p.stato) {
            case p.stati.hidden:
                p.background(50);
                p.textAlign(p.CENTER,p.CENTER);
                p.noStroke();
                p.fill(255);
                p.textSize(p.height/20);
                p.text("tap to\nshow map", p.width/2, p.height/2);
                break;
            case p.stati.shown:
                p.background(50);
                const cell_size = p.width/maze.length;
                const player_pos = p5.Vector.mult(player.pos,cell_size);
                
                p.stroke(255);
                p.strokeWeight(1);
                for (let raggio of player.rays) {
                    p.line(player_pos.x,player_pos.y,raggio.x*cell_size,raggio.y*cell_size);
                }
        
                p.strokeWeight(2);
                for (let wall of walls) {
                    p.stroke(wall.map_color)
                    let a = p5.Vector.mult(wall.a, cell_size);
                    let b = p5.Vector.mult(wall.b, cell_size);
        
                    p.line(a.x,a.y,b.x,b.y);
                }
        
                p.strokeWeight(cell_size/7.5);
                p.point(player_pos);
                break;
        }
    }
    p.mousePressed = ()=>{
        if (p.mouseX<0||p.mouseY<0||p.mouseX>p.width||p.mouseY>p.height) return true;
        if (p.stato==p.stati.hidden) {
            p.stato=p.stati.shown;
            return false;
        }
        return true;
    },
    p.windowResized = ()=>{
        const lato = map_div.clientWidth;
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});


function cast_ray(angle) {
    const dir = p5.Vector.fromAngle(angle,2*N);
    const x1 = player.pos.x;
    const y1 = player.pos.y;
    const x2 = x1+dir.x;
    const y2 = y1+dir.y;
    let x,y,min_dist = Infinity;
    let muro;
    for (let w of walls) {
        const x3=w.a.x,y3=w.a.y,x4=w.b.x,y4=w.b.y;
        const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if (den==0) continue;
        const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
        const u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
        if (t > 0 && t < 1 && u > 0 && u < 1) {
            const xi = x1+t*(x2-x1);
            const yi = y1+t*(y2-y1);
            d = Math.sqrt(Math.pow(x1-xi,2)+Math.pow(y1-yi,2));
            if (d < min_dist) {
                min_dist = d;
                muro=w;
                x=xi;
                y=yi;
            }
        }
    }
    return {
        x: x,
        y: y,
        angle: angle,
        wall: muro,
        dist: min_dist,
    };
}

function calcMaze(p) {
    maze = [];
    for (let i=0; i<N; i++) {
        maze.push([]);
        for (let j=0; j<N; j++) {
            maze[i].push({
                visitato: false,
                muri: [true,true,true,true],
                x:j,y:i,
            });
        }
    }

    const stack = [];
    maze[0][0].visitato = true;
    stack.push(maze[0][0]);
    while (stack.length>0) {
        const corrente = stack.pop();
        const vicini = [0,1,2,3].map(d=>{
            const y = corrente.y + [-1,0,1,0][d];
            const x = corrente.x + [0,1,0,-1][d];
            if (x>=0 && y>=0 && x<N && y<N && maze[y][x].visitato===false) {
                return {
                    cella: maze[y][x],
                    dir: d
                };
            }
            return null;
        }).filter(a=>a);
        if (vicini.length>0) {
            stack.push(corrente);
            const prossimo = vicini[Math.floor(Math.random()*vicini.length)]
            prossimo.cella.visitato=true;
            corrente.muri[prossimo.dir] = false;
            prossimo.cella.muri[(prossimo.dir+2)%4] = false;
            stack.push(prossimo.cella)
        }
    }
    
    const blue = p.color(0,151,175);
    const white = p.color(255,255,255);
    walls = [
        {a:p.createVector(N,0),b:p.createVector(N,N),game_color:white,map_color:blue},
        {a:p.createVector(0,N),b:p.createVector(N,N),game_color:white,map_color:blue},
        {a:p.createVector(N-0.8,N-0.8),b:p.createVector(N-0.2,N-0.2),map_color:p.color(0,255,0), game_color:p.color(0,255,0)},
        {a:p.createVector(N-0.2,N-0.8),b:p.createVector(N-0.8,N-0.2),map_color:p.color(0,255,0), game_color:p.color(0,255,0)},
    ];
    let wall_start, wall_end;
    for (let i=0; i<N; i++) {
        for (let j=0; j<N; j++) {
            if (!wall_start && maze[i][j].muri[0]) {
                wall_start = p.createVector(j,i);
            }
            if (wall_start && maze[i][j].muri[0]) {
                wall_end = p.createVector(j+1,i);
            }
            if (wall_start && !maze[i][j].muri[0]) {
                walls.push({a:wall_start,b:wall_end,game_color:white,map_color:blue});
                wall_start = undefined;
                wall_end = undefined;
            }
        }
        if (wall_start) {
            walls.push({a:wall_start,b:wall_end,game_color:white,map_color:blue});
            wall_start = undefined;
            wall_end = undefined;
        }
    }
    wall_start=undefined, wall_end=undefined;
    for (let j=0; j<N; j++) {
        for (let i=0; i<N; i++) {
            if (!wall_start && maze[i][j].muri[3]) {
                wall_start = p.createVector(j,i);
            }
            if (wall_start && maze[i][j].muri[3]) {
                wall_end = p.createVector(j,i+1);
            }
            if (wall_start && !maze[i][j].muri[3]) {
                walls.push({a:wall_start,b:wall_end,game_color:white,map_color:blue});
                wall_start = undefined;
                wall_end = undefined;
            }
        }
        if (wall_start) {
            walls.push({a:wall_start,b:wall_end,game_color:white,map_color:blue});
            wall_start = undefined;
            wall_end = undefined;
        }
    }
}