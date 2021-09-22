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
console.log(positionAttribute);

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

geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 10;

const clock = new THREE.Clock();

cube.position.x = -50;
cube.position.y = -50;

var direction = 1;

//
// fetch the key frame file
//
// let keyframeString = await loadTextResource("./keyframe-input.txt");

let keyFrameString =
	"0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0 \n \
1.0  4.0 0.0 0.0 1.0 1.0 -1.0 30.0 \n \
2.0  8.0 0.0 0.0 1.0 1.0 -1.0 90.0 \n \
3.0  12.0 12.0 12.0 1.0 1.0 -1.0 180.0 \n \
4.0  12.0 18.0 18.0 1.0 1.0 -1.0 270.0 \n \
5.0  18.0 18.0 18.0 0.0 1.0 0.0 90.0 \n \
6.0  18.0 18.0 18.0 0.0 0.0 1.0 90.0 \n \
7.0  25.0 12.0 12.0 1.0 0.0 0.0 0.0 \n \
8.0  25.0 0.0 18.0 1.0 0.0 0.0 0.0 \n \
9.0  25.0 1.0 18.0 1.0 0.0 0.0 0.0";


let keyFrames = parseKFString(keyFrameString);
let kfAnim = new KFAnimator(keyFrameString);

console.log(keyFrameString);

//
// render
//

cube.position.x = 

function animate() {
	requestAnimationFrame(animate);

	
	renderer.render(scene, camera);
}
animate();
