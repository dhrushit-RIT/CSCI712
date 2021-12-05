const scene = new THREE.Scene();
const cnv = document.getElementById("c");
const side = window.innerWidth;
const renderer = new THREE.WebGLRenderer({ canvas: cnv });
var handle;
const fileInput = document.getElementById("formFile");
fileInput.addEventListener("change", handleFiles, false);
let fieldOfView = 45, aspectRatio = 4 / 3, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);
const material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
const sceneManager = new SceneManager(scene);
camera.position.set(200, 200, 200);
camera.lookAt(0, 100, 0);
scene.add(camera);
const clock = new THREE.Clock();
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
var threeSkeleton = null;
function makeSkeleton(skeletonStructure) {
    console.log({ skeletonStructure });
}
function parseFrames(motionData) {
    let lines = motionData.split("\n").map((item) => item.trim());
    let numframes = parseInt(lines[1].split("\t")[1]);
    let frameRate = parseFloat(lines[2].split("\t")[1]);
    let frames = [];
    let frameLines = lines.slice(3);
    for (let line of frameLines) {
        let frameInfo = {};
        let parts = line.split("\t").map((item) => parseFloat(item));
        let start = 0;
        for (let part of skeletonStructure.partsSequenceForOffset) {
            let partInfo = {};
            for (let channel of skeletonStructure.skeletonParts[part].channels) {
                partInfo[channel] = parts[start];
                start++;
            }
            frameInfo[part] = partInfo;
        }
        frames.push(frameInfo);
    }
    return {
        numframes,
        frames,
        frameRate,
    };
}
var motionDataInfo;
var skeletonStructure;
function parseFileContent(inputText) {
    let [header, motionData] = inputText.split("MOTION");
    skeletonStructure = parseStructure(header);
    threeSkeleton = skeletonStructure["threeRoot"];
    scene.clear();
    if (handle)
        cancelAnimationFrame(handle);
    frameIndex = 0;
    scene.add(threeSkeleton);
    console.log(threeSkeleton);
    motionDataInfo = parseFrames(motionData);
    animate();
}
function afterFileLoads(fileContentText) {
    parseFileContent(fileContentText);
}
let endTimeFactor = 1;
var frameIndex = 0;
function animate() {
    handle = requestAnimationFrame(animate);
    frameIndex += 1;
    frameIndex %= motionDataInfo.numframes;
    const skeletonInfo = motionDataInfo.frames[frameIndex];
    for (let part in skeletonInfo) {
        skeletonStructure.threeSkeletonParts[part].setFromFrameInfo(skeletonInfo[part]);
    }
    renderer.render(scene, camera);
}
//# sourceMappingURL=app.js.map