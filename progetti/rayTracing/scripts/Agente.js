class Agente{
    constructor(x, y, direzione, FOV){
        this.pos = createVector(x, y);
        this.direzione = p5.Vector.fromAngle(radians(direzione));
        this.FOV = radians(FOV);
        this.raggi = [];
        for (let i = -FOV/2; i<FOV/2; i+=0.5){
            this.raggi.push(new Raggio(this.pos, radians(i)));
        }
    }
    
    sposta(distanza){
        var spostamento = this.direzione.copy();
        spostamento.mult(distanza);
        this.pos.add(spostamento);
        this.pos.x = constrain(this.pos.x, 0, larghezza);
        this.pos.y = constrain(this.pos.y, 0, height);
    }
    
    ruota(angolo){
        this.direzione.rotate(radians(angolo));
        for(let raggio of this.raggi){
            raggio.angolo+=radians(angolo)
        }
    }
    
    setFOV(val){
        this.FOV = radians(val);
        this.raggi = [];
        for (let i = -val/2; i<val/2; i+=0.5){
            this.raggi.push(new Raggio(this.pos, this.direzione.heading() + radians(i)));
        }
    }
    
    getFrame(muri){
        let ret = [];
        for (let raggio of this.raggi){
            let dest = raggio.trovaFineAndMuro(muri);
            if (dest[0] != null){
                ret.push(dest);
            }
        }
        return ret;
    }
    
    disegna(muri){
        fill(255);
        noStroke();
        circle(this.pos.x, this.pos.y, 6);
        for (let raggio of this.raggi){
            let dest = raggio.trovaFine(muri);
            if (dest != null){
                stroke(255,100);
                strokeWeight(2);
                line(this.pos.x, this.pos.y, dest.x, dest.y);
            }
        }
    }
}