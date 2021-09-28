const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const side = Math.min(window.innerWidth, window.innerHeight);
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
renderer.setSize(side, side);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(5, 5, 5);
console.log(geometry);
const material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
const positionAttribute = geometry.getAttribute("position");
const colors = [];
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
];
const cube = new THREE.Mesh(geometry, materials);
camera.position.set(0, 0, -100);
scene.add(cube);
camera.lookAt(cube.position);
scene.add(camera);
const clock = new THREE.Clock();
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;
let keyFrameString = [
    "0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0",
    "1.0  4.0 0.0 0.0 1.0 1.0 -1.0 30.0",
    "2.0  8.0 0.0 0.0 1.0 1.0 -1.0 90.0",
    "3.0  12.0 12.0 12.0 1.0 1.0 -1.0 180.0",
    "4.0  12.0 18.0 18.0 1.0 1.0 -1.0 270.0",
    "5.0  18.0 18.0 18.0 0.0 1.0 0.0 90.0",
    "6.0  18.0 18.0 18.0 0.0 0.0 1.0 90.0",
    "7.0  25.0 12.0 12.0 1.0 0.0 0.0 0.0",
    "8.0  25.0 0.0 18.0 1.0 0.0 0.0 0.0",
    "9.0  25.0 1.0 18.0 1.0 0.0 0.0 0.0",
].join("\n");
let keyFrames = parseKFString(keyFrameString);
let kfAnim = new KFAnimator(keyFrameString);
cube.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
cube.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
console.log(keyFrameString);
const canvas = renderer.domElement;
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;
console.log(renderer.domElement.clientHeight, renderer.domElement.clientWidth);
function animate() {
    let handle = requestAnimationFrame(animate);
    let elapsedTime = clock.getElapsedTime();
    let currentKF = kfAnim.getKFAt(elapsedTime);
    cube.position.x = currentKF.pos.x;
    cube.position.y = currentKF.pos.y;
    cube.position.z = currentKF.pos.z;
    cube.rotation.setFromQuaternion(currentKF.quat);
    renderer.render(scene, camera);
}
animate();
//# sourceMappingURL=app.js.map