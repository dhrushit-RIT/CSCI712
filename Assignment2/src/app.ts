// init scene
const scene = new THREE.Scene();

// init renderer
const side = window.innerWidth / 3;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(side, side);

// set up camera
let fieldOfView = 45,
	aspectRatio = 4 / 3,
	near = 0.1,
	far = 1000;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);


const material = new THREE.MeshBasicMaterial({
	vertexColors: false,
});


const sceneManager = new SceneManager(scene);

// set up camera
camera.position.set(7, 7, -7);
camera.lookAt(0, 0, 0);

scene.add(camera);

const clock = new THREE.Clock();

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//
// render
//
const canvas = renderer.domElement;
let endTimeFactor = 1;
function animate() {

	let handle = requestAnimationFrame(animate);
	sceneManager.myUpdate(clock.getElapsedTime());
	renderer.render(scene, camera);
}

animate();
