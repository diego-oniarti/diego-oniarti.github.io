import { read_obj } from "../shared/read_obj.js";

new p5(p=>{
    const div = document.getElementById("glitch_cube");

    let stopped = true;

    let XOR, loaded_xor, prom_xor=new Promise(r=>loaded_xor=r);
    let old_frame, next_frame, changes;

    let righe, loaded_righe, prom_righe = new Promise(r=>loaded_righe=r);
    const vertici = [], facce = [];

    p.preload = async function() {
        XOR  = p.loadShader("./shaders/XOR/shader.vert","./shaders/XOR/shader.frag",loaded_xor);
        righe= p.loadStrings("./objs/cube.obj",loaded_righe);
    }

    p.setup = async function() {
        await Promise.all([prom_xor,prom_righe]);

        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        p.background(50);
        resizeCollapsable();
        canvas.parent("glitch_cube");
        canvas.class("bordered");

        old_frame = p.createGraphics(lato,lato);
        old_frame.background(255,0,0);
        next_frame = p.createGraphics(lato,lato,p.WEBGL);
        changes = p.createGraphics(lato,lato);

        const letti = read_obj(righe,p);
        vertici.push(...letti.vertici);
        facce.push(...letti.facce);


        p.noLoop();
    }

    p.draw = function() {
        changes.background(255);

        const punti_proj = [];
        for (const vertice of vertici) {
            let p_proj = p5.Vector.add(vertice, p.createVector(0,0,1.0));
            p_proj = p.createVector(p_proj.x/p_proj.z, p_proj.y/p_proj.z);
            p_proj.mult(p.width);
            p_proj.x += p.width/2;
            p_proj.y += p.height/2;
            punti_proj.push(p_proj);
        }

        changes.stroke(0,255,255);
        changes.strokeWeight(1);
        for (const faccia of facce) {
            for (let i=0; i<faccia.length; i++) {
                const a = punti_proj[faccia[i]];
                const b = punti_proj[faccia[(i+1)%faccia.length]];

                changes.line(a.x,a.y, b.x,b.y);
            }
        }

        const A = p.PI*0.005;
        for (let vertice of vertici) {
            let oldx = vertice.x;
            let oldz = vertice.z;
            vertice.x = (oldx*p.cos(A) - oldz*p.sin(A));
            vertice.z = (oldx*p.sin(A) + oldz*p.cos(A));
            
            oldz = vertice.z;
            let oldy = vertice.y;
            vertice.y = oldy*p.cos(A*5*(p.noise(p.frameCount/50)*2-1)) - oldz*p.sin(A*5*(p.noise(p.frameCount/50)*2-1))
            vertice.z = oldy*p.sin(A*5*(p.noise(p.frameCount/50)*2-1)) + oldz*p.cos(A*5*(p.noise(p.frameCount/50)*2-1))
        }

        if (p.frameCount%20<=15) {
            old_frame.background(255,0,0)
        }

        next_frame.shader(XOR);
        XOR.setUniform('old_frame', old_frame);
        XOR.setUniform('changes', changes);
        next_frame.rect(0,0,next_frame.width*2,next_frame.height*2);

        old_frame.image(next_frame, 0,0, old_frame.width, old_frame.height);
        old_frame.strokeWeight(5);

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
        old_frame.background(255,0,0);
        next_frame.resizeCanvas(lato,lato);
        changes.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});
