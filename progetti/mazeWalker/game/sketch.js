const game_div = document.getElementById('game_div');
const map_div = document.getElementById('map_div');

const N = 10;
const SPEED = 0.05;
const FOV = Math.PI/3;
let maze, player, walls;

new p5(p=>{
    p.setup = ()=>{
        const lato = game_div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.parent('game_div');
        resizeCollapsable();
        
        // crea il player
        player = {
            pos: p.createVector(0.5, 0.5),
            dir: 0,
            keys: {w:false,a:false,s:false,d:false},
        };

        // crea il labirinto
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
        
        walls = [{a:p.createVector(N,0),b:p.createVector(N,N)},{a:p.createVector(0,N),b:p.createVector(N,N)}];
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
                    walls.push({a:wall_start,b:wall_end});
                    wall_start = undefined;
                    wall_end = undefined;
                }
            }
            if (wall_start) {
                walls.push({a:wall_start,b:wall_end});
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
                    walls.push({a:wall_start,b:wall_end});
                    wall_start = undefined;
                    wall_end = undefined;
                }
            }
            if (wall_start) {
                walls.push({a:wall_start,b:wall_end});
                wall_start = undefined;
                wall_end = undefined;
            }
        }
    }
    p.draw = ()=>{
        p.background(255);

        

        //update player
        if (player.keys.w) {
            player.pos.add(p5.Vector.fromAngle(player.dir, SPEED));
        }
        if (player.keys.s) {
            player.pos.sub(p5.Vector.fromAngle(player.dir, SPEED));
        }
        if (player.keys.a) {
            player.dir -= p.PI/40;
        }
        if (player.keys.d) {
            player.dir += p.PI/40;
        }
    }
    p.keyPressed = ()=>{
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
new p5(p=>{
    p.setup = ()=>{
        const lato = map_div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.parent('map_div');
        resizeCollapsable();
    }
    p.draw = ()=>{
        if (!maze) return;
        p.background(0);
        p.strokeWeight(2);
        p.stroke(0, 151, 175);
        const cell_size = p.width/maze.length;

        for (let wall of walls) {
            let a = p5.Vector.mult(wall.a, cell_size);
            let b = p5.Vector.mult(wall.b, cell_size);

            p.line(a.x,a.y,b.x,b.y);
        }

        p.strokeWeight(cell_size/7.5);
        p.point(p5.Vector.mult(player.pos,p.width/N));
    }
    p.windowResized = ()=>{
        const lato = map_div.clientWidth;
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});
