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
        console.log(`${initalXSpeed} ${initalYSpeed}`)
        this.rotationSpeed = initalRotationSpeed 
    }
    step(){
        this.triangle.position.x += this.Xspeed;
        this.triangle.position.y += this.Yspeed;
        this.triangle.rotation.z += this.rotationSpeed;

        //sets triangle to the opposing side of the screen if it goes out of bounds
        this.triangle.position.x = (this.triangle.position.x > 7.25) ? -7.25 : this.triangle.position.x;
        this.triangle.position.x = (this.triangle.position.x < -7.25) ? 7.25 : this.triangle.position.x;
        this.triangle.position.y = (this.triangle.position.y  > 5.05) ? -4 : this.triangle.position.y;
        this.triangle.position.y = (this.triangle.position.y < -4) ? 5.45 : this.triangle.position.y;
    }
}
//creates the esstentials
const scene = new THREE.Scene();
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
    let newTriangle = new triangle(-4,2,RandomRange(-0.05,0.05),RandomRange(-0.002,0.002),0.01)
    scene.add(newTriangle.triangle)
    return newTriangle
}
function RandomRange(min, max){
    // swaps min and max is min was actually more than max
    if (min > max){
        let tempMin = min;
        min = max;
        max = tempMin
    }
    //checks if one is negative
    if (min < 0){
        //50% falls in the negatives and percent of the time is in the positives 
        if(Math.random() > 0.5){
            return Math.random() * max
        }
        else{
            return Math.random() * min
        }
    }
    else{
        //returns a regular range else
        return Math.random() * (max - min) + min;
    }

}