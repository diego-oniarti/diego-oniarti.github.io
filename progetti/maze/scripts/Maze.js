class Maze{
  constructor(rows,cols, width, height, seed){
    this.rows = rows;
    this.cols = cols;
    this.width=width;
    this.height=height;
    if (seed) {
	this.seed=seed;
    }else{
	this.seed=Math.floor(random(100000));
	console.log("seed: "+this.seed);
    }    

    this.cellWidth=this.width/this.cols;
    this.cellHeight=this.height/this.rows;
    
    this.buildGrid();
    this.buildMaze();
    this.buildLines();
  }
  
  buildGrid(){
    let grid=[];
    for (let r=0; r<this.rows; r++){
      grid.push([]);
      for (let c=0; c<this.cols; c++){
        grid[r].push(new Cell());
      }
    }
    
    for (let r=0; r<this.rows; r++){
      for (let c=0; c<this.cols; c++){
        if (r>0          ) grid[r][c].vicini[0] = grid[r-1][c];
        if (c<this.cols-1) grid[r][c].vicini[1] = grid[r][c+1];
        if (r<this.rows-1) grid[r][c].vicini[2] = grid[r+1][c];
        if (c>0          ) grid[r][c].vicini[3] = grid[r][c-1];
      }
    }
    
    this.grid=grid;
  }
  
  buildMaze(){
    randomSeed(this.seed)
    const stack=[];
    stack.push(this.grid[0][0]);
    this.grid[0][0].visited=true;
    
    var corrente  = stack[0];
    while (stack.length > 0){
      const vicini = [];
      for (let vicino of corrente.vicini){
        if (vicino && vicino.visited==false) vicini.push(vicino)
      }
      if (vicini.length>0){
        //const destinazione = vicini[Math.floor(Math.random()*vicini.length)];
        const destinazione = random(vicini);
        corrente.connect(destinazione);
        stack.push(destinazione);
        corrente = destinazione;
        destinazione.visited=true;
      }else{
        corrente = stack.pop();
      }
    }
  }
  
  draw(Xoff, Yoff){
    for (let linea of this.lines){
      if (linea[4]){
        stroke(0,255,0)
      }else{
        stroke(250)
      }
      line(linea[0]+Xoff, linea[1]+Yoff, linea[2]+Xoff,linea[3]+Yoff);
    }
  }
  
  buildLines(){
    const lines=[];
    //linee orizzontali
    for (let r=0; r<this.rows; r++){
      const y = r*this.cellHeight;
      let attivo=false;
      for (let c=0; c<this.cols; c++){
        if (!attivo && this.grid[r][c].muri[0]){
          attivo=true;
          lines.push([
            c*this.cellWidth,
            y
          ]);
        }
        if (attivo && !this.grid[r][c].muri[0]){
          attivo=false;
          lines[lines.length-1].push(c*this.cellWidth);
          lines[lines.length-1].push(y);
        }
      }
      if (attivo){
        lines[lines.length-1].push(this.width);
        lines[lines.length-1].push(y);
      }
    }
    
    //linee verticali
    for (let c=0; c<this.cols; c++){
      const x = c*this.cellWidth;
      let attivo=false;
      for (let r=0; r<this.rows; r++){
        if (!attivo && this.grid[r][c].muri[3]){
          attivo=true;
          lines.push([
            x,
            r*this.cellHeight
          ]);
        }
        if (attivo && !this.grid[r][c].muri[3]){
          attivo=false;
          lines[lines.length-1].push(x);
          lines[lines.length-1].push(r*this.cellHeight);
        }
      }
      if (attivo){
        lines[lines.length-1].push(x);
        lines[lines.length-1].push(this.height);
      }
    }
    
    lines.push([this.width,0,this.width,this.height]);
    lines.push([0,this.height,this.width,this.height]);
    
    lines.push([this.width-this.cellWidth*(3/4), this.height-this.cellHeight*(3/4),
                this.width-this.cellWidth*(1/4), this.height-this.cellHeight*(1/4),
               true]);
    
    lines.push([this.width-this.cellWidth*(3/4), this.height-this.cellHeight*(1/4),
                this.width-this.cellWidth*(1/4), this.height-this.cellHeight*(3/4),
               true]);
    
    this.lines=lines;
  }
}








