import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Array to store draggable objects and edges mapping
const draggableObjects = [];
const edgesMapping = new Map(); // Maps meshes to their corresponding edges


let shapeIdCounter = 1;

// Function to create a tetrahedron with a solid color and black edges
function createTetrahedron(position, size, color) {
    // Create the tetrahedron geometry
    const geometry = new THREE.TetrahedronGeometry(size);

    // Create the solid color material
    const material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = `shape-${shapeIdCounter++}`;

    // Create the edges
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black edges
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    // Add both mesh and edges to the scene
    mesh.position.copy(position);
    edges.position.copy(position);

    scene.add(mesh);
    scene.add(edges);

    // Store the mesh as draggable and map it to its edges
    draggableObjects.push(mesh);
    edgesMapping.set(mesh, edges);
}

// Base vertices of the central tetrahedron
const centralVertices = [
    new THREE.Vector3(0, 1, 2),             // Top
    new THREE.Vector3(-0.87, 0, 0.5), // Bottom left
    new THREE.Vector3(0.87, 0, 0.5),  // Bottom right
    new THREE.Vector3(0, 0, -1)            // Back
];

// Create the central (top) tetrahedron
createTetrahedron(centralVertices[0], 1, 0xff0000); // Top tetrahedron (Red)

// Add three smaller tetrahedrons at the base vertices
createTetrahedron(centralVertices[1], 1, 0x00ff00); // Bottom left corner (Green)
createTetrahedron(centralVertices[2], 1, 0x0000ff); // Bottom right corner (Blue)
createTetrahedron(centralVertices[3], 1, 0xffff00); // Back corner (Yellow)

// Set up OrbitControls for camera movement
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Smooth camera movement
orbitControls.dampingFactor = 0.05;
orbitControls.minDistance = 2; // Set minimum zoom distance
orbitControls.maxDistance = 10; // Set maximum zoom distance

// Set up DragControls
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

// Update edges position during dragging
dragControls.addEventListener('drag', (event) => {
    const draggedMesh = event.object;
    const associatedEdges = edgesMapping.get(draggedMesh);
    if (associatedEdges) {
        associatedEdges.position.copy(draggedMesh.position);
    }
    console.log(
        `Dragged shape (${draggedMesh.name}) position: x=${draggedMesh.position.x}, y=${draggedMesh.position.y}, z=${draggedMesh.position.z}`
    );});

// Disable OrbitControls while dragging
dragControls.addEventListener('dragstart', () => {
    orbitControls.enabled = false; // Disable camera controls during drag
});

function logAllShapePositions() {
    console.log('Current positions of all shapes:');
    draggableObjects.forEach((mesh) => {
        console.log(
            `Shape (${mesh.name}): x=${mesh.position.x.toFixed(2)}, y=${mesh.position.y.toFixed(2)}, z=${mesh.position.z.toFixed(2)}`
        );
    });
}

dragControls.addEventListener('dragend', () => {
    orbitControls.enabled = true; // Re-enable camera controls after drag
    logAllShapePositions();
});

// Position the camera and start rendering
camera.position.set(3, 3, 5);
camera.lookAt(0, 1, 2);

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update(); // Update camera controls
    renderer.render(scene, camera);
}

animate();
