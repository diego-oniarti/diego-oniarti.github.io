class Drone{  
    constructor(x, y, z, poligono){
      this.pos = createVector(x,y,z);
      this.velocita = p5.Vector.random3D();
      this.accelerazione = createVector(0,0);
      this.vicini = [];
      this.seed = random(1);
      this.poligono = poligono
    }
    
    update(){
      this.velocita.add(this.accelerazione);
      this.accelerazione.set(0,0);
      
      this.velocita.mult(1.01);
      this.velocita.limit(0.3);
      this.muri();
      this.pos.add(this.velocita);
    }
    
    calcolaVicini(droni){
      this.vicini = [];
      for (var drone of droni){
//        if (this.vicini.length>21) break;
        let d = dist(this.pos.x,this.pos.y,this.pos.z, drone.pos.x,drone.pos.y,drone.pos.z);
        if (drone!=this && d < 5){
          this.vicini.push(drone);
        }
      }
    }
    aggregazione(mult){
        if (this.vicini.length == 0){return;}
        
        var puntoMedio = this.pos.copy();
        for (var vicino of this.vicini){
            puntoMedio.add(vicino.pos);
        }
        puntoMedio.div(this.vicini.length+1);
        var forza = p5.Vector.sub(puntoMedio, this.pos);
        
        forza.mult(mult);
        this.accelerazione.add(forza);
    }

    allineamento(mult){
        if (this.vicini.length == 0){return;}
        
        var velocitaMedia = this.velocita.copy();
        for (var vicino of this.vicini){
            velocitaMedia.add(vicino.velocita);
        }
        velocitaMedia.div(this.vicini.length+1);
//        velocitaMedia.div(this.vicini.length);
        velocitaMedia.sub(this.velocita);
        
        velocitaMedia.mult(mult);
        this.accelerazione.add(velocitaMedia);
    }
    separazione(mult){
        if (this.vicini.length == 0){return;}
        if (this.vicini.length == 1){mult /= 1}
        
        var repulsione = createVector(0,0);
        for (var vicino of this.vicini){
            var tmp = p5.Vector.sub(this.pos, vicino.pos);
            tmp.setMag(1/tmp.mag());
            repulsione.add(tmp);
        }
        repulsione.div(this.vicini.length);


        repulsione.mult(mult);
        this.accelerazione.add(repulsione);
    }
    centro(mult){
    return;
        let attrazione = p5.Vector.mult(this.pos,-1)
        attrazione.mult(mult);
        this.accelerazione.add(attrazione);
    }
    casuale(){
        //this.velocita.rotate(map(noise(this.seed), 0,1, -PI/30, PI/30)); 
        //this.seed+=0.01;
        let tmp = p5.Vector.random3D();
        tmp.div(100)
        this.velocita.add(tmp)
    }
    mostra(){
        const tmp = p5.Vector.add(this.pos, p5.Vector.mult(this.velocita,1000))
        this.poligono.lookAt(tmp.x, tmp.y, tmp.z)
        if (this.poligono.userData["error"]) this.poligono.rotateX(PI/2)
        //this.poligono.rotateY(PI/2)
        this.poligono.position.set(this.pos.x-WIDTH/2, this.pos.y-HEIGHT/2, this.pos.z-DEPTH/2)
    }
    mouse(m){
        let d = this.pos.dist(m);
        let v = 100;
        if (d<v){
            let direzione = p5.Vector.sub(this.pos, m).normalize();
            direzione.setMag(map(d, 0,v, v,0));
            this.accelerazione.add(direzione);
        }
    }
    
    muri(){
        if (this.pos.x<0){
            this.pos.x = WIDTH;
        }
        if (this.pos.x > WIDTH){
            this.pos.x = 0;
        }
        if (this.pos.y<0){
            this.pos.y = HEIGHT;
        }
        if (this.pos.y > HEIGHT){
            this.pos.y = 0;
        }
        if (this.pos.z<0){
            this.pos.z = DEPTH;
        }
        if (this.pos.z > DEPTH){
            this.pos.z = 0;
        }
        
        var margine = 1;
        var m = 50;
        var speed = this.velocita.mag();
        var futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        /*while (futuro.x >= WIDTH-margine){
            this.velocita.x -= 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
        while (futuro.x <= margine){
            this.velocita.x += 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
        while (futuro.y >= HEIGHT-margine){
            this.velocita.y -= 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
        while (futuro.y <= margine){
            this.velocita.y += 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
        while (futuro.z >= DEPTH-margine){
            this.velocita.z -= 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
        while (futuro.z <= margine){
            this.velocita.z += 0.005;
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }*/
        while (futuro.x >= WIDTH-margine || futuro.x <= margine || futuro.y >= HEIGHT-margine || futuro.y <= margine || futuro.z >= DEPTH-margine || futuro.z <= margine){
            let tmp = p5.Vector.sub(createVector(WIDTH/2, HEIGHT/2, DEPTH/2),this.pos);
            tmp.div(1000)
            this.velocita.add(tmp);
            this.velocita.setMag(speed);
            futuro = p5.Vector.add(this.pos,p5.Vector.mult(this.velocita,m));
        }
    }
  }