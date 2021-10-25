const scene = new THREE.Scene();
const cnv = document.getElementById("c");
const side = window.innerWidth;
const renderer = new THREE.WebGLRenderer({ canvas: cnv });
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);
const material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
const sceneManager = new SceneManager(scene);
camera.position.set(7, 7, 0);
camera.lookAt(0, 0, 0);
scene.add(camera);
const clock = new THREE.Clock();
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
let endTimeFactor = 1;
function animate() {
    let handle = requestAnimationFrame(animate);
    sceneManager.myUpdate(clock.getElapsedTime());
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=app.js.map