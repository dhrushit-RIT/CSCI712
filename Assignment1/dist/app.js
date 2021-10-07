const scene_linear = new THREE.Scene();
const scene_catmull = new THREE.Scene();
const scene_ut = new THREE.Scene();
const scene_bzd = new THREE.Scene();
const canvas_linear = document.getElementById("c1");
const canvas_catmull = document.getElementById("c2");
const canvas_ut = document.getElementById("c3");
const canvas_bzd = document.getElementById("c4");
const side = window.innerWidth / 3;
const renderer_linear = new THREE.WebGLRenderer({ canvas: canvas_linear });
const renderer_catmull = new THREE.WebGLRenderer({ canvas: canvas_catmull });
const renderer_ut = new THREE.WebGLRenderer({ canvas: canvas_ut });
const renderer_bzd = new THREE.WebGLRenderer({ canvas: canvas_bzd });
renderer_linear.setSize(side, side);
renderer_catmull.setSize(side, side);
renderer_ut.setSize(side, side);
renderer_bzd.setSize(side, side);
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera_linear = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const camera_catmull = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const camera_ut = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const camera_bzd = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
];
const cube_linear = new THREE.Mesh(geometry, materials);
const cube_catmull = new THREE.Mesh(geometry, materials);
const cube_ut = new THREE.Mesh(geometry, materials);
const cube_bzd = new THREE.Mesh(geometry, materials);
camera_linear.position.set(0, 0, -20);
camera_catmull.position.set(0, 0, -20);
camera_ut.position.set(0, 0, -20);
camera_bzd.position.set(0, 0, -20);
camera_linear.lookAt(5, 0, 0);
camera_catmull.lookAt(5, 0, 0);
camera_ut.lookAt(5, 0, 0);
camera_bzd.lookAt(5, 0, 0);
scene_linear.add(cube_linear);
scene_catmull.add(cube_catmull);
scene_ut.add(cube_ut);
scene_bzd.add(cube_bzd);
scene_linear.add(camera_linear);
scene_catmull.add(camera_catmull);
scene_ut.add(camera_ut);
scene_bzd.add(camera_bzd);
const clock = new THREE.Clock();
cube_linear.position.x = 0;
cube_linear.position.y = 0;
cube_linear.position.z = 0;
cube_catmull.position.x = 0;
cube_catmull.position.y = 0;
cube_catmull.position.z = 0;
cube_ut.position.x = 0;
cube_ut.position.y = 0;
cube_ut.position.z = 0;
cube_bzd.position.x = 0;
cube_bzd.position.y = 0;
cube_bzd.position.z = 0;
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
let kfAnim_linear = new KFAnimator(keyFrameString);
let kfAnim_catmull = new CRAnimator(keyFrameString);
let kfAnim_ut = new CRAnimator(keyFrameString);
let kfAnim_bzd = new BezierAnimator(keyFrameString);
kfAnim_ut.setMappedControl(true);
cube_linear.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
cube_catmull.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
cube_ut.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
cube_bzd.position.set(keyFrames[0].pos.x, keyFrames[0].pos.y, keyFrames[0].pos.z);
cube_linear.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
cube_catmull.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
cube_ut.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
cube_bzd.quaternion.setFromAxisAngle(new THREE.Vector3(keyFrames[0].orientation.xa, keyFrames[0].orientation.ya, keyFrames[0].orientation.za), keyFrames[0].orientation.theeta);
const canvas = renderer_linear.domElement;
let endTime = keyFrames[keyFrames.length - 1].time;
let endTimeFactor = 1;
function animate() {
    let handle = requestAnimationFrame(animate);
    let elapsedTime = clock.getElapsedTime();
    if (elapsedTime > endTime) {
        endTimeFactor += 1;
        endTime = keyFrames[keyFrames.length - 1].time * endTimeFactor;
        kfAnim_linear.resetFrames();
        kfAnim_catmull.resetFrames();
        kfAnim_ut.resetFrames();
        kfAnim_bzd.resetFrames();
    }
    elapsedTime = elapsedTime % keyFrames[keyFrames.length - 1].time;
    let currentKF_linear = kfAnim_linear.getKFAt(elapsedTime);
    let currentKF_catmull = kfAnim_catmull.getKFAt(elapsedTime);
    let currentKF_ut = kfAnim_ut.getKFAt(elapsedTime);
    let currentKF_bzd = kfAnim_bzd.getKFAt(elapsedTime);
    cube_linear.position.x = currentKF_linear.pos.x;
    cube_linear.position.y = currentKF_linear.pos.y;
    cube_linear.position.z = currentKF_linear.pos.z;
    cube_catmull.position.x = currentKF_catmull.pos.x;
    cube_catmull.position.y = currentKF_catmull.pos.y;
    cube_catmull.position.z = currentKF_catmull.pos.z;
    cube_ut.position.x = currentKF_ut.pos.x;
    cube_ut.position.y = currentKF_ut.pos.y;
    cube_ut.position.z = currentKF_ut.pos.z;
    cube_bzd.position.x = currentKF_bzd.pos.x;
    cube_bzd.position.y = currentKF_bzd.pos.y;
    cube_bzd.position.z = currentKF_bzd.pos.z;
    cube_linear.rotation.setFromQuaternion(currentKF_linear.quat);
    cube_catmull.rotation.setFromQuaternion(currentKF_catmull.quat);
    cube_ut.rotation.setFromQuaternion(currentKF_ut.quat);
    cube_bzd.rotation.setFromQuaternion(currentKF_bzd.quat);
    renderer_linear.render(scene_linear, camera_linear);
    renderer_catmull.render(scene_catmull, camera_catmull);
    renderer_ut.render(scene_ut, camera_ut);
    renderer_bzd.render(scene_bzd, camera_bzd);
}
animate();
//# sourceMappingURL=app.js.map