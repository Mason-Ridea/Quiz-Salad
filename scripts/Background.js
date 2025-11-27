import * as THREE from "three";

// Robot Bobby is, in fact, the goat
const Canvas = document.getElementById("Background");
const WindowHeight = window.innerHeight
const WindowWidth = window.innerWidth

class triangle {
    constructor(scene){
        //makes the actual triangle thing
        let vertices = new Float32Array([
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
             0.0, 0.0, 0.0
        ])
        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute('position', new THREE.BufferAttribute(vertices,3)) 
        const material = new THREE.MeshBasicMaterial({color : 0xff0000, side :THREE.DoubleSide }) 
        this.triangle = new THREE.Mesh(buffer, material);
        scene.add(this.triangle);
    }
}
//creates the esstentials
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, WindowWidth / WindowHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(WindowWidth, WindowHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement); //adds straight to the document directly no need to append it to anything extra

camera.position.z = 5;
let triangles = [new triangle(scene)];
function animate(){
    renderer.render(scene, camera);
}

