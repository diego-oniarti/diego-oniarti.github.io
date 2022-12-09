class Player{
  constructor(x,y, lines, scale){
    const linetemp = []
    for (let linea of lines){
      linetemp.push([
        linea[0]*scale,
        linea[1]*scale,
        linea[2]*scale,
        linea[3]*scale,
        linea[4]]
      );
    }
    
    this.scale=scale;
    this.pos = createVector(x,y);
    this.rot = p5.Vector.fromAngle(0);
    this.FOV=PI/3;
    this.risoluzione = 100;
    this.lines=linetemp;
    this.tasti = {
      a: false,
      d: false,
      w: false,
      s: false
    };
    this.rays=[];
    this.vittoria = false;
  }
  
  draw(Xoff, Yoff){
    circle(this.pos.x/this.scale+Xoff, this.pos.y/this.scale+Yoff, 7);
    strokeWeight(1);
    stroke(255);
    for (let ray of this.rays){
      ray.draw(Xoff, Yoff, this.scale);
    }
  }
  
  drawView(Xoff,Yoff){
    const maxDist = min(height,width);
    // const maxDist = dist(0,0, width,height/2);
    rectMode(CENTER);
    const W=width/2/this.risoluzione;
    const thisHeading = this.rot.heading();
    colorMode(HSB)
    strokeWeight(1);
    for (let i=0; i<this.rays.length; i++){
      // const d = this.rays[i].dist;
      let d = cos(this.rays[i].angle.heading()-thisHeading)*this.rays[i].dist;
      
      const c = map(d, 0,maxDist, 100, 10);
      if (this.rays[i].traguardo){
        fill(120,100,c)
        stroke(120,100,c);
      }else{
        fill(1, 0, c);
        stroke(1,0,c)
      }
      // const h = map(d, 0,maxDist, height/2, 0)
      let h = d/20;
      h = constrain((1/h)*height, 0,height);
      
      rect((i+0.5)*W+Xoff, height/2+Yoff, W,h);
    }
    colorMode(RGB);
    rectMode(CORNER)
  }
  
  update(){
    // this.rays[0] = newwa Ray(this.pos.x, this.pos.y, this.rot.heading());
    const angolo = this.FOV/this.risoluzione;
    const heading = this.rot.heading();
    for (let i=0; i<this.risoluzione; i++){
      this.rays[i] = new Ray(this.pos.x, this.pos.y, heading+(i-this.risoluzione/2)*angolo)
    }
    
    let front = new Ray(this.pos.x, this.pos.y, heading);
    let back = new Ray(this.pos.x, this.pos.y, heading+PI);
    let verticale = new Ray(this.pos.x, this.pos.y, (sin(heading)>0)?HALF_PI:-HALF_PI);
    let orizzontale = new Ray(this.pos.x, this.pos.y, (cos(heading)>0)?0:PI);
    let verticaleInv = new Ray(this.pos.x, this.pos.y, (sin(heading)<0)?HALF_PI:-HALF_PI);
    let orizzontaleInv = new Ray(this.pos.x, this.pos.y, (cos(heading)<0)?0:PI);
    
    for (let linea of this.lines){
      for (let ray of this.rays){
        ray.proietta(linea);
      }
      front.proietta(linea)      
      back.proietta(linea)      
      verticale.proietta(linea)      
      orizzontale.proietta(linea)   
      verticaleInv.proietta(linea)      
      orizzontaleInv.proietta(linea)       
    }
    if (false){ //mostra linee guida sulla mappa
      stroke(255)
      strokeWeight(1)
      front.draw(width/2, 0, this.scale);
      back.draw(width/2, 0, this.scale);
      verticale.draw(width/2, 0, this.scale);
      orizzontale.draw(width/2, 0, this.scale);
      verticaleInv.draw(width/2, 0, this.scale);
      orizzontaleInv.draw(width/2, 0, this.scale);
    }
      
    if (this.tasti.a) this.rot.rotate(-PI/60);
    if (this.tasti.d) this.rot.rotate(PI/60);
    if (this.tasti.w && (front.dist>5 || front.traguardo)) this.pos.add(this.rot);
    if (this.tasti.s && (back.dist>5 || back.traguardo)) this.pos.sub(this.rot);
    
    if (this.tasti.w && front.dist<=5 && !front.traguardo){
      if (verticale.dist>=5 || verticale.traguardo) this.pos.y += sin(heading);
      if (orizzontale.dist>=5 || orizzontale.traguardo) this.pos.x += cos(heading);
    }
    if (this.tasti.s && back.dist<=5 && !back.traguardo){
      if (verticaleInv.dist>=5 || verticaleInv.traguardo) this.pos.y -= sin(heading);
      if (orizzontaleInv.dist>=5 || orizzontaleInv.traguardo) this.pos.x -= cos(heading);
    }
    
    if (front.traguardo && front.dist<5) this.vittoria = true;
    if (back.traguardo && back.dist<5) this.vittoria = true;
  }
}