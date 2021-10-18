const scene = new THREE.Scene();
const side = window.innerWidth / 3;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(side, side);
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);
const BALL_DIM_FT = 0.0859375;
const material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
const sceneManager = new SceneManager(scene);
camera.position.set(7, 7, -7);
camera.lookAt(0, 0, 0);
scene.add(camera);
const clock = new THREE.Clock();
const canvas = renderer.domElement;
let endTimeFactor = 1;
function animate() {
    let handle = requestAnimationFrame(animate);
    sceneManager.myUpdate();
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=app.js.map