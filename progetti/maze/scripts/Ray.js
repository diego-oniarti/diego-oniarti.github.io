class Ray{
  constructor(x,y, angle){
    this.pos = createVector(x,y);
    this.angle=p5.Vector.fromAngle(angle);
  
    this.dest = undefined;
    this.dist = Infinity;
    this.traguardo = false;
  }
  
  proietta(linea){
    const x1=linea[0];
    const y1=linea[1];
    const x2=linea[2];
    const y2=linea[3];
    
    const x3=this.pos.x;
    const y3=this.pos.y;
    const x4=this.angle.x+x3;
    const y4=this.angle.y+y3;
    
    const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    if (den==0) return;
    
    const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4)) / den
    const u = ((x2-x1)*(y1-y3)-(y2-y1)*(x1-x3)) / den
    
    if (0<t && t<1 && u>0){
      //c'è un intersezione
      const tmp = createVector(
        x1+t*(x2-x1),
        y1+t*(y2-y1)
      );
      let d = this.pos.dist(tmp);
      if (d < this.dist){
        this.dest=tmp;
        this.dist=d;
        if (linea[4]){
          this.traguardo=true;
        }else{
          this.traguardo=false;
        }
      }
    }    
  }
  
  draw(Xoff, Yoff, scale){
    if (!this.dest) return false;
    line(this.pos.x/scale+Xoff, this.pos.y/scale+Yoff, this.dest.x/scale+Xoff, this.dest.y/scale+Yoff);
    return true;
  }
}