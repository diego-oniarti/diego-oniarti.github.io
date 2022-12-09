class Cell{
  constructor(){
    this.vicini = [];
    this.muri = [true, true, true, true];
    this.visited=false;
  }
  
  connect(cella){
    let index = this.vicini.indexOf(cella);
    this.muri[index] = false;
    
    cella.muri[(index+2)%4] = false;
  }
}