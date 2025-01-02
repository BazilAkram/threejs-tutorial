import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color("gray")

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const shape = new THREE.TetrahedronGeometry(2);
const material = new THREE.MeshBasicMaterial({color: "blue", flatShading:true});
const cube = new THREE.Mesh(shape,material);
scene.add(cube);

const edges = new THREE.EdgesGeometry(shape);
const lineMaterial = new THREE.LineBasicMaterial({ color: "black" });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireframe);

camera.position.z = 5;

function animate(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    wireframe.rotation.x = cube.rotation.x;
    wireframe.rotation.y = cube.rotation.y;
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);
