const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 100);
// scene.add(camera);
const renderer = new THREE.WebGLRenderer();
const side = Math.min(window.innerWidth, window.innerHeight);
renderer.setSize(side, side);
document.body.appendChild(renderer.domElement);

//
// add cube to the scene
//
const geometry = new THREE.BoxGeometry(10, 10, 10);
console.log(geometry);
const material = new THREE.MeshBasicMaterial({
	vertexColors: true,
});

const positionAttribute = geometry.getAttribute("position");

const colors = [];
const color = new THREE.Color();
console.log(positionAttribute)

for (let i = 0; i < positionAttribute.count; i += 6) {
	
	color.set(Math.random() * 0xffffff);
	
	// define the same color for each vertex of a triangle
	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);

	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);
}

geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 10;

const clock = new THREE.Clock();

cube.position.x = -50;
cube.position.y = -50;

var direction = 1;

//
// render
//
function animate() {
	requestAnimationFrame(animate);

	var elapsedTime = clock.getElapsedTime() % 40;
	if (elapsedTime > 20) {
		elapsedTime = 40 - elapsedTime;
	}

	// console.log(elapsedTime);
	const posX = -50 + 5 * elapsedTime;
	const posY = -50 + 5 * elapsedTime;
	// console.log(elapsedTime);
	const rotY_degrees = 18 * elapsedTime;
	const rotY_radians = (rotY_degrees * 2 * Math.PI) / 360;

	cube.position.x = posX;
	cube.position.y = posY;

	cube.rotation.y = rotY_radians;
	renderer.render(scene, camera);
}
animate();
