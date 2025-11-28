import * as THREE from "three";
// Robot Bobby is, in fact, the goat
const Canvas = document.getElementById("Background");
const WindowHeight = window.innerHeight;
const WindowWidth = window.innerWidth;

const MiniumTriangles = 200;
const maxiumTriangles = 400;

class triangle {
    constructor(initalXPos,initalYPos,initalXSpeed,initalYSpeed,initalRotationSpeed){
    //makes the actual triangle thing
        
        let Zaxis = Math.random()
        let vertices = new Float32Array([
            -1.0, -1.0, Zaxis,
             1.0, -1.0, Zaxis,
             0.0, 0.0, Zaxis
        ])
        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute('position', new THREE.BufferAttribute(vertices,3));
        const material = new THREE.MeshBasicMaterial({color : 0x600000, side :THREE.DoubleSide });
        material.transparent = true
    //declares varibles 
        //positioning
        this.triangle = new THREE.Mesh(buffer, material);
        this.triangle.position.x = initalXPos;
        this.triangle.position.y = initalYPos;
        this.triangle.rotation.z = Math.random() * 2.5
        if (initalXSpeed < 0){
            this.Xspeed = initalXSpeed* -1;
            this.Xsign = -1
        } else{
            this.Xspeed = initalXSpeed;
            this.Xsign = 1 }
        if (initalYSpeed < 0){
            this.Yspeed = initalYSpeed * -1;
            this.Ysign = -1
        } else{
            this.Yspeed = initalYSpeed;
            this.Ysign = 1; }
        this.YAccel = 0.0;
        this.XAccel = 0.0;
        this
        this.MiniumYspeed = RandomRange(0.002, 0.0035);
        this.MiniumXspeed = RandomRange(0.002, 0.0035);
        this.RotationSpeed = initalRotationSpeed;
        this.RotationAccel = 0.0;
        //looks
        this.opacity = RandomRange(0.25,0.55)
        this.CurrentColor = this.triangle.material.color;
        this.NextColor = this.triangle.material.color;
        this.ColorTransition = 0;
    }
    step(){
        //updates position and rotation
        this.triangle.position.x +=  this.Xspeed * this.Xsign;
        this.triangle.position.y +=  this.Yspeed * this.Ysign;
        this.triangle.rotation.z += this.RotationSpeed;

        //sets triangle to the opposing side of the screen if it goes out of bounds
        this.triangle.position.x = (this.triangle.position.x > 7.25) ? -7.25 : this.triangle.position.x;
        this.triangle.position.x = (this.triangle.position.x < -7.25) ? 7.25 : this.triangle.position.x;
        if (this.triangle.position.y > 5.2){this.triangle.position.y = -4.0}
        else if (this.triangle.position.y  < -4.2){this.triangle.position.y = 5}
        
        //accelerates speed based on accelerations varibles
        this.Xspeed += Math.min(this.XAccel / 10, Math.floor(35 + this.XAccel*300)/100);
        this.Yspeed += Math.min(this.YAccel / 10, Math.floor(35 + this.YAccel*300)/100);
        this.RotationSpeed += this.RotationAccel / 10;
        this.XAccel *= 0.9;
        this.YAccel *= 0.9;
        
        const decelerationRate = 0.003;
        //deaceleration
        if (this.XAccel < 0.003 && this.Xspeed > this.MiniumXspeed){
            this.Xspeed = Math.max(this.MiniumXspeed,this.Xspeed - decelerationRate);
        }
        if (this.YAccel < 0.003 && this.Xspeed > this.MiniumXspeed){
            this.Yspeed = Math.max(this.MiniumYspeed,this.Yspeed - decelerationRate);
        }

        // caps the upper limits of speed 
        this.Xspeed = Math.min(0.55, this.Xspeed);
        this.Yspeed = Math.min(0.55, this.Yspeed);
        this.RotationAccel *= 0.9;
        //updates the look of the triangle
        this.triangle.material.opacity = this.opacity
        if( this.ColorTransition < 1){
            this.ColorTransition += 0.0001;
        }
        else{
            this.CurrentColor = this.triangle.material.color
        }
        this.triangle.material.color.lerpColors(this.CurrentColor, this.NextColor, this.ColorTransition);
    }
    Accelerate(X, Y, RotationAccel){
        this.XAccel = X;
        this.YAccel = Y;
        
        this.Xspeed += X * 0.25;
        this.Yspeed += Y * 0.25;
        this.RotationAccel = RotationAccel;
        //has a chance to flip speed values
        this.Xsign *= Math.random() > 0.5 ? 1 : -1;
        this.Ysign *= Math.random() > 0.5 ? 1 : -1;
        this.NextColor = new THREE.Color(0xFF0080);
    }
}

//creates the esstentials
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, WindowWidth/WindowHeight, 0.1, 10 );
const renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.insertBefore(renderer.domElement,Canvas);
camera.position.z = 5;
camera.position.y = 0.6;
let triangles = [];
for (let i = 0; i < MiniumTriangles; i++){
    triangles.push(addTriangle());
}
function animate(){
    triangles.forEach(x => {x.step();}) // calls step() on all triangles
    renderer.render(scene, camera);
}

function addTriangle(){
    //parameters for the triangles are randomized
    let initialXPosition = RandomRange(-6.8, 6.8);
    let initialYPosition = RandomRange(-4,5);
    let initalXSpeed = RandomRange(-0.05,0.05);;
    let initalYSpeed = RandomRange(-0.05,0.05);;
    let initalRotationSpeed = RandomRange(-0.02,0.04);
    let newTriangle = new triangle(initialXPosition,initialYPosition,initalXSpeed,initalYSpeed,initalRotationSpeed);
    scene.add(newTriangle.triangle);
    return newTriangle;
}

export function Pulse(){
    if (triangles.length <= maxiumTriangles){
        triangles.push(addTriangle());
    }
    triangles.forEach(x =>{
        x.Accelerate(RandomRange(0.01,0.11), RandomRange(0.01,0.11), 0.0)
    })
}

export function halt(){
    if(triangles.length > 4 ){
        scene.remove(triangles.pop().triangle);
    }

}

function RandomRange(min, max){
    // swaps min and max is min was actually more than max
    if (min > max){
        let tempMin = min;
        min = max;
        max = tempMin;
    }
    //checks if one is negative
    if (min < 0){
        //50% falls in the negatives and percent of the time is in the positives 
        if(Math.random() > 0.5){
            return Math.random() * max;
        }
        else{
            return Math.random() * min;
        }
    }
    else{
        //returns a regular range else
        return Math.random() * (max - min) + min;
    }

}
