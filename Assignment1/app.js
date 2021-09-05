const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 10);
// scene.add(camera);
const renderer = new THREE.WebGLRenderer();
const side = Math.min(window.innerWidth, window.innerHeight);
renderer.setSize(side, side);
document.body.appendChild(renderer.domElement);

//
// add cube to the scene
//
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 10;

const clock = new THREE.Clock();


cube.position.x = -50;
cube.position.y = -50;

var direction = 1;
const distancePerSecondX = 100 / 20;
const distancePerSecondY = 100 / 20;

//
// render
//
function animate() {
	requestAnimationFrame(animate);

	var elapsedTime = clock.getElapsedTime() % 40;
	if (elapsedTime > 20){
		elapsedTime = 40 - elapsedTime;
	}

	console.log(elapsedTime)
	const posX = -50 + 5 * elapsedTime;
	const posY = -50 + 5 * elapsedTime;
	const rotY = direction * 8 * elapsedTime;

	cube.position.x = posX;
	cube.position.y = posY;

	cube.rotation.y = rotY;
	renderer.render(scene, camera);
}
animate();
