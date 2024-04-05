new p5(p=>{
    const div = document.getElementById("bouncing_lines");
    class Punto {
        constructor(pos,vel) {
            this.pos = pos;
            this.vel = vel;
        }
    }
    class Linea {
        constructor(p1,p2,color) {
            this.p1 = p1;
            this.p2 = p2;
            this.color = color;
        }
    }
    class Cleaner {
        constructor(pos, color) {
            this.p= pos;
            this.color = color;
        }
    } 

    const t = 0;
    let stopped = true;

    let XOR, loaded, prom=new Promise(r=>loaded=r);
    let old_frame, next_frame, changes;

    const linee = [], cleaners = [];
    
    p.preload = async function() {
        XOR = p.loadShader("./shaders/XOR/shader.vert","./shaders/XOR/shader.frag",loaded);
    }

    p.setup = async function() {
        await prom;
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        resizeCollapsable();
        canvas.parent("bouncing_lines");
        canvas.class("bordered");

        old_frame = p.createGraphics(lato,lato);
        old_frame.background(0);
        next_frame = p.createGraphics(lato,lato,p.WEBGL);
        changes = p.createGraphics(lato,lato);

        const cv = p.createVector;
        const rp = ()=>{return new Punto(cv(p.random(p.width),p.random(p.height)), p5.Vector.random2D(4));};
        linee.push(new Linea(rp(), rp(), p.color(255,0,0)));
        linee.push(new Linea(rp(), rp(), p.color(0,255,0)));
        linee.push(new Linea(rp(), rp(), p.color(0,0,255)));
        linee.push(new Linea(rp(), rp(), p.color(255)));
        linee.push(new Linea(rp(), rp(), p.color(0)));

        cleaners.push(new Cleaner(rp(), p.color(0)));
        cleaners.push(new Cleaner(rp(), p.color(255)));

        p.noLoop();
    }

    p.draw = function() {
        changes.background(255);
        changes.strokeWeight(1);
        changes.strokeCap(p.SQUARE);

        for (const linea of linee) {
            changes.stroke(linea.color);
            changes.line(linea.p1.pos.x, linea.p1.pos.y, linea.p2.pos.x, linea.p2.pos.y);
        }
        for (const p of [...linee.flatMap(l=>[l.p1,l.p2]), ...cleaners.map(c=>c.p)]) {
            p.pos.add(p.vel);
            if (p.pos.x<0 || p.pos.x>changes.width) p.vel.x*=-1;
            if (p.pos.y<0 || p.pos.y>changes.height) p.vel.y*=-1;
        }

        next_frame.shader(XOR);
        XOR.setUniform('old_frame', old_frame);
        XOR.setUniform('changes', changes);
        next_frame.rect(0,0,next_frame.width*2,next_frame.height*2);

        old_frame.image(next_frame, 0,0, old_frame.width, old_frame.height);
        old_frame.strokeWeight(5);

//        if (p.frameCount%10<3) {
//            let ugly = false;
//            for (let cnr of cleaners) {
//                const A = -p.frameCount/(ugly?200:120)+(ugly?0:p.PI/2);
//
//                const a = p.createVector(Math.cos(A)*p.width*2, Math.sin(A)*p.height*2);
//                const b = p.createVector(Math.cos(A+p.PI)*p.width*2, Math.sin(A+p.PI)*p.height*2);
//                a.add(cnr.p.pos);
//                b.add(cnr.p.pos);
//
//                old_frame.stroke(cnr.color);
//                old_frame.line(a.x,a.y,b.x,b.y);
//
//                ugly = true;
//            }
//        }
        p.image(next_frame,0,0);
    }

    p.mousePressed = function() {
        if (p.mouseX<0||p.mouseY<0||p.mouseX>p.width||p.mouseY>p.height) return;
        stopped = !stopped;
        if (stopped) p.noLoop();
        else p.loop();
    }

    p.windowResized = function() {
        const lato = div.clientWidth;
        p.resizeCanvas(lato,lato);
        old_frame.resizeCanvas(lato,lato);
        next_frame.resizeCanvas(lato,lato);
        changes.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});
