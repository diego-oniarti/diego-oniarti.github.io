class QuadTree{
    /*PVector pos;
    float larghezza, altezza;
    QuadTree[] figli;
    ArrayList<T> punti;
    private int capacita; */ 
    
    constructor(x, y, z, larghezza, altezza, profondita, capacita){
      this.pos = createVector(x,y,z);
      this.larghezza=larghezza;
      this.altezza = altezza;
      this.profondita = profondita
      this.punti = [];
      this.capacita = capacita;
  }
    
    mostra(){
      /*noFill();
      strokeWeight(1);
      stroke(255);
      rect(this.pos.x,this.pos.y, this.larghezza,this.altezza);
      strokeWeight(2);
      if (this.figli){
        for (var qt of this.figli){
          qt.mostra();
        }
      }*/
      /*for (let punto of this.punti){   
        point(punto.pos.x, punto.pos.y);
      }*/
    }
    
    contenuto(punto){
      return !(punto.pos.x<=this.pos.x || punto.pos.x>this.pos.x+this.larghezza || punto.pos.y<=this.pos.y || punto.pos.y>this.pos.y+this.altezza || punto.pos.z<=this.pos.z || punto.pos.z>this.pos.z+this.profondita);
    }
    
    creaFigli(){
      this.figli = [
        new QuadTree(this.pos.x,                    this.pos.y,                    this.pos.z,                    this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x+this.larghezza/2,   this.pos.y,                    this.pos.z,                    this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x,                    this.pos.y+this.altezza/2,     this.pos.z,                    this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x+this.larghezza/2,   this.pos.y+this.altezza/2,     this.pos.z,                    this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x,                    this.pos.y,                    this.pos.z+this.profondita/2,  this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x+this.larghezza/2,   this.pos.y,                    this.pos.z+this.profondita/2,  this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x,                    this.pos.y+this.altezza/2,     this.pos.z+this.profondita/2,  this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita),
        new QuadTree(this.pos.x+this.larghezza/2,   this.pos.y+this.altezza/2,     this.pos.z+this.profondita/2,  this.larghezza/2, this.altezza/2, this.profondita/2, this.capacita)
      ];
    }
    
    aggiungiPunto(punto){
      if (!this.contenuto(punto)) return;
      if (this.punti.length < this.capacita){
        this.punti.push(punto);
      }else{
        if (!this.figli) {this.creaFigli();}
        var index = ((punto.pos.z>this.pos.z+this.profondita/2? 1:0)<<2) + ((punto.pos.y>this.pos.y+this.altezza/2? 1:0)<<1) + ((punto.pos.x>this.pos.x+this.larghezza/2? 1:0)<<0);
        this.figli[index].aggiungiPunto(punto);
      }
    }
    
    cercaPunti(angolo, larghezza, altezza,profondita){
      var ret = [];
      this.cercaPuntiR(angolo,larghezza,altezza,profondita,ret);    
      return ret;
    }
    
    cercaPuntiR(angolo, larghezza, altezza,profondita, lista){
      for (let p of this.punti){
        if (!(p.pos.x<angolo.x || p.pos.y<angolo.y || p.pos.z<angolo.z || p.pos.x>angolo.x+larghezza || p.pos.y>angolo.y+altezza || p.pos.z>angolo.z+profondita)){
          lista.push(p);
        }
      }
      if (this.figli){
        for (let figlio of this.figli){
          if (!(figlio.pos.x+figlio.larghezza<angolo.x || figlio.pos.y+figlio.altezza<angolo.y || figlio.pos.z+figlio.profondita<angolo.z ||  figlio.pos.x>angolo.x+larghezza || figlio.pos.y>angolo.y+altezza || figlio.pos.z>angolo.z+profondita)){
            figlio.cercaPuntiR(angolo,larghezza,altezza,profondita,lista);
          }
        }
      }
    }
  }