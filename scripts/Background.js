import * as THREE from "three";

// Robot Bobby is, in fact, the goat
const Canvas = document.getElementById("Background");
const WindowHeight = window.innerHeight
const WindowWidth = window.innerWidth

class triangle {
    constructor(initalXPos,initalYPos,initalXSpeed,initalYSpeed,initalRotationSpeed){
        //makes the actual triangle thing
        let vertices = new Float32Array([
            -1.0, -1.0, 0.0,
             1.0, -1.0, 0.0,
             0.0, 0.0, 0.0
        ])
        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute('position', new THREE.BufferAttribute(vertices,3)) 
        const material = new THREE.MeshBasicMaterial({color : 0xff0000, side :THREE.DoubleSide }) 
        //declares the class varibles
        this.triangle = new THREE.Mesh(buffer, material);
        this.triangle.position.x = initalXPos;
        this.triangle.position.y = initalYPos;
        this.Xspeed = initalXSpeed;
        this.Yspeed = initalYSpeed;
        this.rotationSpeed = initalRotationSpeed 
    }
    step(){
        this.triangle.position.x += this.Xspeed;
        this.triangle.position.y += this.Yspeed;
        this.triangle.rotation.z += this.rotationSpeed;

        //sets triangle to the opposing side of the screen if it goes out of bounds
        this.triangle.position.x = (this.triangle.position.x > 7.25) ? -7.25 : this.triangle.position.x;
        this.triangle.position.x = (this.triangle.position.x < -7.25) ? 7.25 : this.triangle.position.x;
        this.triangle.position.y = (this.triangle.position.y  > 6) ? -4 : this.triangle.position.y;
        this.triangle.position.y = (this.triangle.position.y < -4) ? 6 : this.triangle.position.y;
        console.log(this.triangle.position.y);
    }
}
//creates the esstentials
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);
const camera = new THREE.PerspectiveCamera(75, WindowWidth/WindowHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.insertBefore(renderer.domElement,Canvas)
camera.position.z = 5;
camera.position.y = 0.6;
let triangles = [addTriangle()];
function animate(){
    triangles[0].step()
    renderer.render(scene, camera);
}
function addTriangle(){
    let newTriangle = new triangle(-4,2,0.0,0.03,0.01)
    scene.add(newTriangle.triangle)
    return newTriangle
}
