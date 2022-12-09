class Raggio{
    constructor(origine, angolo){
        this.pos = origine;
        this.angolo = angolo;
    }
    
    disegna(){
        push();
        translate(this.pos.x, this.pos.y);
        const p2 = p5.Vector.fromAngle(this.angolo, 20);
        stroke(255);
        line(0,0, p2.x, p2.y);
        pop();
    }
    
    trovaFine(muri){
        const p2 = p5.Vector.fromAngle(this.angolo,width+height);
        const x1 = this.pos.x;
        const y1 = this.pos.y;
        const x2 = this.pos.x+p2.x;
        const y2 = this.pos.y+p2.y;
        
        let min = Infinity;
        let fine = null;
        for (let muro of muri){
            let x3 = muro.x1;
            let y3 = muro.y1;
            let x4 = muro.x2;
            let y4 = muro.y2;
            
            let den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
            if (den == 0){
                //return;       nessuna intersezione con questo muro
            }else{
                let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
                let u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
                if (t > 0 && t<1 && u>0 && u<1){
                    let intersezione = createVector(x1+t*(x2-x1), y1+t*(y2-y1));
                    let d = dist(x1, y1, intersezione.x, intersezione.y);
                    if (d < min){
                        min = d;
                        fine = intersezione;
                    }
                }else{
                    //return;   nessuna intersezione con questo muro
                }
            }
        }
        return fine;
    }
}