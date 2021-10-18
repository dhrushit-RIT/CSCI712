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
const TABLE_LENGTH_FT = 12;
const TABLE_WIDTH_FT = 6;
const BALL_DIM_FT = 0.15;

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

let table: Table = new Table(materials);

// Table.createTable().then((ret_table) => {
// 	table = ret_table;
// });
// const cube = new THREE.Mesh(geometry, materials);

//
// setup a ball
//

const geometry_ball = new THREE.SphereGeometry(BALL_DIM_FT, 32, 32);
const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh= new THREE.Mesh(geometry_ball, material_ball);
let ball: Ball = new Ball(BALL_DIM_FT, geometry_ball, material_ball);

// const ball = new THREE.Mesh(geometry_ball, material_ball);
scene.add(ball);

// set up camera
camera.position.set(7, 7, -7);
camera.lookAt(0, 0, 0);

// add camera and cube to the scene
scene.add(table);
scene.add(camera);

const clock = new THREE.Clock();

// set initial position of cubes
table.position.x = 0;
table.position.y = -0.1;
table.position.z = 0;

ball.position.x = 0;
ball.position.y = 0;
ball.position.z = 0;

let vels=ball.setParamsball();

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

	vels.x *= 0.7; 
	vels.z *= 0.7;

	 // add velocity to ball
	 ball.position.x += vels.x;
	 ball.position.y += 0;
	 ball.position.z += vels.z;

	// table.myUpdate();
	// ball1.
	renderer.render(scene, camera);
}
animate();
