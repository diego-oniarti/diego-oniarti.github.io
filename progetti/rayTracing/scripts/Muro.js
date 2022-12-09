class Muro{
    constructor(x1, y1, x2, y2, mobile, HUE){
        this.mobile = mobile;
        if (this.mobile){
            this.i = random(10000);
            this.j = random(10000);
            this.k = random(10000);
            this.m = random(10000);
            this.x1 = noise(this.i)*larghezza;
            this.y1 = noise(this.j)*height;
            this.x2 = noise(this.k)*larghezza;
            this.y2 = noise(this.m)*height;
            this.HUE = HUE;
            this.saturation = 100;
        }else{
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.HUE = 0;
            this.saturation = 0;
        }
    }
    
    update(){
        if (this.mobile){
            let incremento = slider2.value()/1000;
            this.i+=incremento;
            this.j+=incremento;
            this.k+=incremento;
            this.m+=incremento;
            this.x1 = noise(this.i)*larghezza;
            this.y1 = noise(this.j)*height;
            this.x2 = noise(this.k)*larghezza;
            this.y2 = noise(this.m)*height;
        }
    }
    
    disegna(){
        colorMode(HSB);
        stroke(this.HUE, this.saturation, 100);
        strokeWeight(3);
        line(this.x1, this.y1, this.x2, this.y2);
        colorMode(RGB);
    }
}