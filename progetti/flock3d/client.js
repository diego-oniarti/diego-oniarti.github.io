new p5()

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;

let mouse, rayCaster;

mouse = new THREE.Vector2();
rayCaster = new THREE.Raycaster();

const N = 50;
const droni = [];

const WIDTH = 70, HEIGHT = 50, DEPTH = 70;


const group = new THREE.Group();
const pesci = new THREE.Group();
const box = new THREE.Mesh( 
    new THREE.BoxGeometry(
        WIDTH,
        HEIGHT,
        DEPTH
    ),
    new THREE.MeshStandardMaterial({
        color: 0x404040,
        roughness: 1,
        blending:THREE.AdditiveBlending,
        transparent:true
    })
);
group.add(box)

const loader = new THREE.OBJLoader();

// load a resource
loader.load(
	// resource URL
	'../pesce.obj',
	// called when resource is loaded
	function ( object ) {
        popola(object);
	},
    ()=>{},
    (error)=>{popola();console.log(error)}
);

function popola(object){
    if (object){
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh){
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xffa0a0,
                    roughness: 1,
                    emissive: new THREE.Color(0xf00000)
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.scale.set(0.5, 0.5, 0.5)
    }else{
        object = new THREE.Mesh( 
            new THREE.CylinderGeometry(
                0,
                1,
                3,
                4
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffa0a0,
                roughness: 1,
                emissive: new THREE.Color(0xf00000)
            })
        );
        object.userData["error"]=true;
    }
    for (let i=0; i<N; i++){
        let tmp = object.clone();
        tmp.material = new THREE.MeshStandardMaterial({
            color: 0xffa0a0,
            roughness: 1,
            emissive: new THREE.Color(0xf00000)
        })
        tmp.traverse(function(child) {
            if (child instanceof THREE.Mesh){
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xffa0a0,
                    roughness: 1,
                    emissive: new THREE.Color(0xf00000)
                });
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        tmp.castShadow = true;
        tmp.receiveShadow = true;
        pesci.add(tmp);
        droni.push(new Drone( 5+random(WIDTH-10),5+random(HEIGHT-10),5+random(DEPTH-10),tmp ));
    }
    group.add(pesci);
    scene.add( group );
}

const directionalLight = new THREE.DirectionalLight(0x66d9ff, 1)
directionalLight.castShadow = true;
directionalLight.position.set(0,24,0);
directionalLight.shadowRadius = 2
directionalLight.shadow.camera.top = -100 // default
directionalLight.shadow.camera.right = 100 // default
directionalLight.shadow.camera.left = -100 // default
directionalLight.shadow.camera.bottom = 100 // default
scene.add(directionalLight);


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        70,
        70
    ),
    new THREE.MeshStandardMaterial({
        color: 0x7ae4ff
    })
);
plane.rotation.set(-PI/2,0,0)
plane.position.y = -25
plane.receiveShadow=true
scene.add(plane)


camera.position.set(40,70,70);
controls = new THREE.OrbitControls( camera );

const ambient = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambient );


let t=0;
function animate() {
    requestAnimationFrame( animate );

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    qt = new QuadTree(0,0,0,WIDTH,HEIGHT,DEPTH,1);
    for (let drone of droni){
        qt.aggiungiPunto(drone)
    }
    for (d of droni){
        d.mostra();
    }
    for (d of droni){
        //d.calcolaVicini(droni);
        d.calcolaVicini(qt.cercaPunti(createVector(d.pos.x-5,d.pos.y-5,d.pos.z-5),10,10,10));
        /*d.aggregazione(0.015);
        d.allineamento(0.08);
        d.separazione(15);*/
        d.aggregazione(0.031*1.25);
        d.allineamento(0.06);
        d.separazione(0.525*0.9);
        d.centro(11);
        d.casuale();
    }  
    for (d of droni){
        d.update();
    }



    t+=1
    premi();
    renderer.render( scene, camera );
    controls.update();
};

function premi(){
    /*rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects(pesci.children);
//    for (let intersect of intersects){
    if (intersects[0]){
        intersects[0].object.material.color.setHex(0x0000ff);
        intersects[0].object.material.emissive.setHex(0x0000ff);}
//    }*/
}
function onMouseMove(event){
    mouse.x = (event.clientX/window.innerWidth)*2-1;
    mouse.y = -(event.clientY/window.innerHeight)*2+1;
}
function onClick(event){
    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects(pesci.children);
    if (intersects[0]){
        intersects[0].object.material.color.setHex(0x0000ff);
        intersects[0].object.material.emissive.setHex(0x0000ff);
    }

}
window.addEventListener('mousemove', onMouseMove,false);
window.addEventListener('click', onClick)

animate();