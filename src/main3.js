import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up OrbitControls for camera movement
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Smooth camera movement
orbitControls.dampingFactor = 0.05;
orbitControls.minDistance = 2; // Set minimum zoom distance
orbitControls.maxDistance = 10; // Set maximum zoom distance

// Function to create a tetrahedron with solid color and visible black edges
function createTetrahedron(position, size, color, central=false) {
    // Create the tetrahedron geometry
    const geometry = new THREE.TetrahedronGeometry(size);

    // Create the solid color material
    const material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);

    // Add both the tetrahedron to the scene
    mesh.position.copy(position);
    scene.add(mesh);

    // Create the edges
    if(!central){
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black edges
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        edges.position.copy(position);
        scene.add(edges);
    }

    return mesh;
}

// Create the central (top) tetrahedron
const centralTetraSize = 1;
const centralTetraColor = 0xff0000; // Red
const centralTetra = createTetrahedron(new THREE.Vector3(0, 0.5, 0), centralTetraSize, centralTetraColor,true);
centralTetra.visible = false;

// Access the vertices of the central tetrahedron
const centralGeometry = new THREE.TetrahedronGeometry(centralTetraSize);
const positions = centralGeometry.attributes.position.array;

// Extract the bottom vertices (skip the first vertex, which is the top)
const baseVertices = [];
for (let i = 3; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    baseVertices.push(vertex);
}

// Attach smaller tetrahedrons at the bottom vertices
const tetraSize = 1;
baseVertices.forEach((vertex, index) => {

    // Transform vertex to world space by adding the central tetrahedron's position
    const worldPosition = vertex.add(centralTetra.position);

    // Create and position the smaller tetrahedron
    createTetrahedron(worldPosition, tetraSize);
});

// Position the camera and start rendering
camera.position.set(3, 3, 5);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update(); // Update OrbitControls
    renderer.render(scene, camera);
}

animate();
