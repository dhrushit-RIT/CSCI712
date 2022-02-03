// init scene
const scene = new THREE.Scene();
const cnv = document.getElementById("c");
const canvas_container = document.getElementById("canvas_container");
// init renderer
const side = window.innerWidth;
const renderer = new THREE.WebGLRenderer({ canvas: cnv });
// renderer.setSize(side, side);

// set up camera
let fieldOfView = 45,
	aspectRatio = 4 / 3,
	near = 0.1,
	far = 1000;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
canvas_container.appendChild(renderer.domElement);

const material = new THREE.MeshBasicMaterial({
	vertexColors: false,
});

function onFrictionChange() {
	SceneManager.COEFF_FRIC_BALL_SURFACE = parseFloat(
		(frictionCoeffSlider as any).value
	);
}

function onCoEffRestChange() {
	SceneManager.ELASTICITY_BALL_CUSHION = parseFloat(
		(coeffRestSlider as any).value
	);
}

const sceneManager = new SceneManager(scene);
var frictionCoeffSlider = document.getElementById("frictionRange");
frictionCoeffSlider.addEventListener(
	"input",
	onFrictionChange /* () => console.log((slider as any).value) */
);

var coeffRestSlider = document.getElementById("coeff-rest");
coeffRestSlider.addEventListener(
	"input",
	onCoEffRestChange /* () => console.log((slider as any).value) */
);

(frictionCoeffSlider as any).value = SceneManager.COEFF_FRIC_BALL_SURFACE;
(coeffRestSlider as any).value = SceneManager.ELASTICITY_BALL_CUSHION;
// ELASTICITY_BALL_CUSHION
// set up camera
camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);

scene.add(camera);

const clock = new THREE.Clock();

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => sceneManager.resetSceneAndRun());
//
// render
//
// const canvas = renderer.domElement;
let endTimeFactor = 1;
function animate() {
	let handle = requestAnimationFrame(animate);
	sceneManager.myUpdate(clock.getElapsedTime());
	renderer.render(scene, camera);
}

animate();
