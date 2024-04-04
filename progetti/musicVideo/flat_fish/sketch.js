import { read_obj } from "../shared/read_obj.js";
new p5(p=>{
    const div = document.getElementById("flat_fish_div");
    let righe;
    let res, prom = new Promise(r=>{res=r});

    const vertici = [];
    const facce = [];

    p.preload = function () {
        righe = p.loadStrings('../musicVideo/objs/pesce.obj', res);
    }

    p.setup = async function () {
        const lato = div.clientWidth;
        const canvas = p.createCanvas(lato,lato);
        canvas.parent("flat_fish_div");
        canvas.class("bordered");
        resizeCollapsable();
        await(prom);
        const read = read_obj(righe,p);
        vertici.push(...read.vertici);
        facce.push(...read.facce);
    }

    p.draw = function() {
        p.background(50);
        const mid_screen = p.createVector(p.width/2,p.height/2);
        const A = p.PI/75;
        for (const punto of vertici) {
            const x = punto.x;
            const z = punto.z;
            punto.x = x*Math.cos(A) - z*Math.sin(A);
            punto.z = x*Math.sin(A) + z*Math.cos(A);
        }
        p.stroke(0,255,0);
        p.strokeWeight(2);
        for (const faccia of facce) {
            for (let i=0; i<faccia.length; i++){
                const a = vertici[faccia[i]];
                const b = vertici[faccia[(i+1)%faccia.length]];
                const at = p5.Vector.add(p5.Vector.mult(a,p.width/2),mid_screen);
                const bt = p5.Vector.add(p5.Vector.mult(b,p.width/2),mid_screen);
                p.line(at.x, at.y, bt.x, bt.y);
            }
        }
    }

    p.windowResized = function() {
        const lato = div.clientWidth;
        p.resizeCanvas(lato,lato);
        resizeCollapsable();
    }
});
