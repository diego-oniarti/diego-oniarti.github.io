class Agente{
    constructor(x, y){
        this.pos = createVector(x, y);
        this.raggi = [];
        for (let i = 0; i<360; i+=1){
            this.raggi.push(new Raggio(this.pos, radians(i)));
        }
    }
    
    sposta(x, y){
        x = constrain(x, 0, width);
        y = constrain(y, 0, height);
        this.pos.x=x;
        this.pos.y=y;
    }
    
    disegna(muri){
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