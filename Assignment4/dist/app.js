const scene = new THREE.Scene();
const cnv = document.getElementById("c");
const side = window.innerWidth;
const renderer = new THREE.WebGLRenderer({ canvas: cnv });
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const canvas_container = document.getElementById("canvas_container");
canvas_container.appendChild(renderer.domElement);
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
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
];
const pool = [];
const pos = new THREE.Vector3(0, 0, 0);
const size = 0.01;
const color = new THREE.Color(255, 255, 266);
const vel = new THREE.Vector3(0, 0.1, 0);
const acc = new THREE.Vector3(0, 0.1, 0);
const opacity = 1.0;
const delOpacity = -0.01;
const mass = 1;
const lifetime = 10;
const numParticles = 100;
const maxParticles = 10000;
const emmissionRate = 0.1;
const genSide = 0.1;
const particleSystem = new ParticleSystem(numParticles, maxParticles, emmissionRate, {
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
}, genSide);
let keyFrameString = [
    "0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0",
    "3.0  1.0 1.0 1.0 1.0 1.0 -1.0 180.0",
    "6.0  12.0 0.0 0.0 0.0 0.0 1.0 180.0",
].join("\n");
let keyFrames = parseKFString(keyFrameString);
let kfAnim_catmull = new CRAnimator(keyFrameString);
particleSystem.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
scene.add(particleSystem);
particleSystem.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
let endTime = keyFrames[keyFrames.length - 1].time;
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
    let currentKF_catmull = kfAnim_catmull.getKFAt(elapsedTime);
    particleSystem.position.x = currentKF_catmull.pos.x;
    particleSystem.position.y = currentKF_catmull.pos.y;
    particleSystem.position.z = currentKF_catmull.pos.z;
    particleSystem.rotation.setFromQuaternion(currentKF_catmull.quat);
    const delTime = clock.getElapsedTime() - prevTime;
    prevTime = clock.elapsedTime;
    particleSystem.myUpdate(delTime);
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=app.js.map