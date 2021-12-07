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
function onFrictionChange() {
    SceneManager.COEFF_FRIC_BALL_SURFACE = parseFloat(frictionCoeffSlider.value);
}
const sceneManager = new SceneManager(scene);
var frictionCoeffSlider = document.getElementById("frictionRange");
frictionCoeffSlider.addEventListener("input", onFrictionChange);
frictionCoeffSlider.value = SceneManager.COEFF_FRIC_BALL_SURFACE;
camera.position.set(7, 7, 7);
camera.lookAt(0, 0, 0);
scene.add(camera);
const clock = new THREE.Clock();
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => sceneManager.resetSceneAndRun());
let endTimeFactor = 1;
function animate() {
    let handle = requestAnimationFrame(animate);
    sceneManager.myUpdate(clock.getElapsedTime());
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=app.js.map