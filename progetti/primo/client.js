const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0f0f0f );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const N = 9

const geometry = new THREE.BoxGeometry(5/N, 1, 5/N);
//const material = new THREE.MeshPhongMaterial( { color: 0x57ff57  } );
//const material = new THREE.MeshNormalMaterial();
const material = new THREE.MeshStandardMaterial( { 
    color: 0x575757,
    roughness: 1
} );


const group = new THREE.Group();
let griglia = []
for (let i=0; i<N; i++){
    griglia.push([])
    for (let j=0; j<N; j++){
        griglia[i].push(new THREE.Mesh( geometry, material ));
        griglia[i][j].position.set((j-((N-1)/2))*5/N,0,(i-((N-1)/2))*5/N)
        group.add(griglia[i][j])
    }
}
scene.add( group );

camera.position.set(4,7,7);
controls = new THREE.OrbitControls( camera );

const ambient = new THREE.AmbientLight( 0x0f0f0f ); // soft white light
scene.add( ambient );

const spot1 = new THREE.SpotLight( 0xff0000 ,3,100);
spot1.position.set( 5, 5, 5 );
spot1.castShadow = true;
scene.add(spot1)

const spot2 = new THREE.SpotLight( 0x0000ff ,3,100);
spot2.position.set( -5, -5, -5 );
spot2.castShadow = true;
scene.add(spot2)


let t=0;
function animate() {
    requestAnimationFrame( animate );

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    for (let i=0; i<N; i++){
        for (let j=0; j<N; j++){
            griglia[i][j].scale.y = (Math.sin(t/50 + Math.sqrt(Math.pow(i-(N/2-0.5),2) + Math.pow(j-(N/2-0.5),2)))+1)+1
        }
    }

    t+=1
    renderer.render( scene, camera );
    controls.update();
};

animate();