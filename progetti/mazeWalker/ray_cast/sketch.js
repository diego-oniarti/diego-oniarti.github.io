ray_cast_sketch = p => {
    p.div = document.getElementById('ray_casting_div');

    p.setup = function() {
        const lato = Math.min(p.div.clientWidth,400);
        const canvas = p.createCanvas(lato,lato);
        canvas.parent('ray_casting_div');
        resizeCollapsable();
        p.stroke(255);
    }
    p.draw = function() {
        p.background(50);

        const muri = [
            { a: p.createVector(-1,-1), b: p.createVector(p.width+1,-1)},
            { a: p.createVector(p.width+1,-1), b: p.createVector(p.width,p.height)},
            { a: p.createVector(p.width,p.height), b: p.createVector(0,p.height)},
            { a: p.createVector(0,p.height), b: p.createVector(-1,-1)},
        ];
        for (let i=0; i<4; i++) {
            let a = (i+100)*38+p.frameCount/500;
            let b = (i+200)*54+p.frameCount/500;
            muri.push({
                a: p.createVector(p.noise(a,0)*p.width, p.noise(0,a)*p.height),
                b: p.createVector(p.noise(b,0)*p.width, p.noise(0,b)*p.height),
            });
        }

        const x1 = p.constrain(p.mouseX,0,p.width);
        const y1 = p.constrain(p.mouseY,0,p.height);

        p.strokeWeight(8);
        p.stroke(255);
        p.point(x1,y1);
        p.strokeWeight(2);
        for (let i=0; i<360; i++) {
            const dir = p5.Vector.fromAngle(i*Math.PI/180,p.width+p.height);

            const x2 = x1+dir.x;
            const y2 = y1+dir.y;
            let x,y,min_dist = Infinity;
            for (let w of muri) {
                const x3=w.a.x,y3=w.a.y,x4=w.b.x,y4=w.b.y;
                const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
                if (den==0) continue;
                const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
                const u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
                if (t > 0 && t < 1 && u > 0 && u < 1) {
                    const xi = x1+t*(x2-x1);
                    const yi = y1+t*(y2-y1);
                    d = p.dist(x1,y1,xi,yi);
                    if (d < min_dist) {
                        min_dist = d;
                        x=xi;
                        y=yi;
                    }
                }
            }
            p.line(x1,y1,x,y);
        }

        p.strokeWeight(3);
        p.stroke(0, 151, 175);
        for (let muro of muri) {
            p.line(muro.a.x, muro.a.y, muro.b.x, muro.b.y);
        }
    }

    p.windowResized = function() {
        const lato = Math.min(p.div.clientWidth,400);
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
}

const ray_cast_p5 = new p5(ray_cast_sketch);