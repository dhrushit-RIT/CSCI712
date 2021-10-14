// init scene
const scene = new THREE.Scene();

// init canvas
// const canvas_linear = document.getElementById("c1");

// init renderer
const side = window.innerWidth / 3;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(side, side);

// set up camera
// const side = Math.min(window.innerWidth, window.innerHeight);
let fieldOfView = 45,
	aspectRatio = 4 / 3,
	near = 0.1,
	far = 1000;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);

//
// add cube to the scene
//
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	vertexColors: false,
});

const materials: THREE.MeshBasicMaterial[] = [
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
	new THREE.MeshBasicMaterial({ color: 0x0000ff }),
	new THREE.MeshBasicMaterial({ color: 0xff00ff }),
	new THREE.MeshBasicMaterial({ color: 0xffff00 }),
	new THREE.MeshBasicMaterial({ color: 0x00ffff }),
];

const cube = new THREE.Mesh(geometry, materials);

// set up camera
camera.position.set(0, 0, -20);
camera.lookAt(0, 0, 0);

// add camera and cube to the scene
scene.add(cube);
scene.add(camera);

const clock = new THREE.Clock();

// set initial position of cubes
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;

//
// initialize cube
//

//
// render
//
const canvas = renderer.domElement;
let endTimeFactor = 1;
function animate() {
	let handle = requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
