class Muro{
    constructor(x1, y1, x2, y2, mobile){
        this.mobile = mobile;
        if (this.mobile){
            this.i = random(10000);
            this.j = random(10000);
            this.k = random(10000);
            this.m = random(10000);
            this.x1 = noise(this.i)*width;
            this.y1 = noise(this.j)*height;
            this.x2 = noise(this.k)*width;
            this.y2 = noise(this.m)*height;
        }else{
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
    }
    
    update(){
        if (this.mobile){
            let incremento = slider.value/1000;
            this.i+=incremento;
            this.j+=incremento;
            this.k+=incremento;
            this.m+=incremento;
            this.x1 = noise(this.i)*width;
            this.y1 = noise(this.j)*height;
            this.x2 = noise(this.k)*width;
            this.y2 = noise(this.m)*height;
        }
    }
    
    disegna(){
        stroke(255);
        strokeWeight(2);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}