// init scene
const scene = new THREE.Scene();
const cnv = document.getElementById("c");
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
const canvas_container = document.getElementById("canvas_container");

canvas_container.appendChild(renderer.domElement);
// const sceneManager = new SceneManager(scene);

// set up camera
camera.position.set(5, 5, -2);
camera.lookAt(10, 10, 0);

scene.add(camera);

const clock = new THREE.Clock();

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial({
	vertexColors: false,
});

const materials: THREE.MeshBasicMaterial[] = [
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xff0000 */ }),
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x00ff00 */ }),
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x0000ff */ }),
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xff00ff */ }),
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xffff00 */ }),
	new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x00ffff */ }),
];

// const cube = new THREE.Mesh(geometry, materials);
const pool: Particle[] = [];
const pos = new THREE.Vector3(0, 0, 0);
const size = 0.01;
const color = new THREE.Color(255, 255, 266);
const vel = new THREE.Vector3(0, 0.1, 0);
const acc = new THREE.Vector3(0, 0.1, 0);
const opacity = 1.0;
const delOpacity = -0.01;
const mass = 1;
const lifetime = 10;

// const cube = new Particle(
// 	pool,
// 	pos,
// 	size,
// 	color,
// 	vel,
// 	acc,
// 	opacity,
// 	delOpacity,
// 	mass,
// 	lifetime
// );
// cube.position.set(1, 0, 1);

const numParticles = 100;
const maxParticles = 10000;
const emmissionRate = 0.1;
const genSide = 0.1;

const particleSystem = new ParticleSystem(
	numParticles,
	maxParticles,
	emmissionRate,
	{
		color: new THREE.Color(255, 255, 255),
		size: 0.01,
		acceleration: {
			min: new THREE.Vector3(0, 0, 0),
			max: new THREE.Vector3(0, 1, 0),
		},
		velocity: {
			min: new THREE.Vector3(0, 0, 0),
			max: new THREE.Vector3(0, 1, 0),
		},
		alfa: 1.0,
		deltaAlfa: -0.005,
		mass: 1,
		lifeTime: 1,
	},
	genSide
);

let keyFrameString = [
	"0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0",
	// "1.0  4.0 0.0 0.0 1.0 1.0 -1.0 30.0",
	// "2.0  8.0 0.0 0.0 1.0 1.0 -1.0 90.0",
	"3.0  1.0 1.0 1.0 1.0 1.0 -1.0 180.0",
	// "4.0  12.0 18.0 18.0 1.0 1.0 -1.0 270.0",
	// "5.0  18.0 18.0 18.0 0.0 1.0 0.0 90.0",
	"6.0  12.0 0.0 0.0 0.0 0.0 1.0 180.0",
	// "7.0  25.0 12.0 12.0 1.0 0.0 0.0 0.0",
	// "8.0  25.0 0.0 18.0 1.0 0.0 0.0 0.0",
	// "9.0  25.0 1.0 18.0 1.0 0.0 0.0 0.0",
	// "9.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0",
].join("\n");

let keyFrames: MyKeyframe[] = parseKFString(keyFrameString);

let kfAnim_catmull = new CRAnimator(keyFrameString);

particleSystem.position.set(
	keyFrames[0].pos.x,
	keyFrames[0].pos.y,
	keyFrames[0].pos.z
);
scene.add(particleSystem);

particleSystem.quaternion.setFromAxisAngle(
	new THREE.Vector3(
		keyFrames[0].orientation.xa,
		keyFrames[0].orientation.ya,
		keyFrames[0].orientation.za
	),
	keyFrames[0].orientation.theeta
);

let endTime = keyFrames[keyFrames.length - 1].time;

//
// render
//
// const canvas = renderer.domElement;
let endTimeFactor = 1;
let prevTime = 0;
function animate() {
	let handle = requestAnimationFrame(animate);

	let elapsedTime = clock.getElapsedTime();

	if (elapsedTime > endTime) {
		endTimeFactor += 1;
		endTime = keyFrames[keyFrames.length - 1].time * endTimeFactor;
		kfAnim_catmull.resetFrames();
	}
	elapsedTime = elapsedTime % keyFrames[keyFrames.length - 1].time;

	let currentKF_catmull: MyKeyframe = kfAnim_catmull.getKFAt(elapsedTime);

	particleSystem.position.x = currentKF_catmull.pos.x;
	particleSystem.position.y = currentKF_catmull.pos.y;
	particleSystem.position.z = currentKF_catmull.pos.z;

	particleSystem.rotation.setFromQuaternion(currentKF_catmull.quat);


	// sceneManager.myUpdate(clock.getElapsedTime());
	const delTime = clock.getElapsedTime() - prevTime;
	prevTime = clock.elapsedTime;
	particleSystem.myUpdate(delTime);
	renderer.render(scene, camera);
}

animate();
