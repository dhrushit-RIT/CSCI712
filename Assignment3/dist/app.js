var scene = new THREE.Scene();
var mycnv = document.getElementById("c");
var side = window.innerWidth;
var renderer = new THREE.WebGLRenderer({ canvas: mycnv });
var handle;
var fileInputElem = document.getElementById("formFile");
fileInputElem.addEventListener("change", handleFiles, false);
var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
var canvas_container = document.getElementById("canvas_container");
canvas_container.appendChild(renderer.domElement);
var material = new THREE.MeshBasicMaterial({
    vertexColors: false,
});
camera.position.set(300, 300, 300);
camera.lookAt(0, 100, 0);
scene.add(camera);
var myclock = new THREE.Clock();
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
function addPlatform() {
    const geometry = new THREE.BoxGeometry(500, 0.5, 500);
    const material = new THREE.MeshBasicMaterial({ color: 0x8800ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}
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
    addPlatform();
    const slider = document.getElementById("customRange3");
    slider.max = motionDataInfo.numframes;
    animate();
}
function afterFileLoads(fileContentText) {
    parseFileContent(fileContentText);
}
function onSliderChanged() {
    const slider = document.getElementById("customRange3");
    frameIndex = parseInt(slider.value);
}
var frameIndexSlider = document.getElementById("customRange3");
console.log(frameIndexSlider);
frameIndexSlider.addEventListener("input", onSliderChanged);
function onFrameRateChange() {
    frameRate = parseInt(speedSlider.value);
    console.log(frameRate);
}
var speedSlider = document.getElementById("frameRateRange");
speedSlider.value = 60;
speedSlider.addEventListener("input", onFrameRateChange);
var frameRate = 60;
var timeScale = 1;
var endTimeFactor = 1;
var frameIndex = 0;
function animate() {
    setTimeout(function () {
        handle = requestAnimationFrame(animate);
        frameIndex += 1;
        frameIndex %= motionDataInfo.numframes;
        frameIndexSlider.value = frameIndex;
        const skeletonInfo = motionDataInfo.frames[frameIndex];
        for (let part in skeletonInfo) {
            skeletonStructure.threeSkeletonParts[part].setFromFrameInfo(skeletonInfo[part]);
        }
    }, 1000 / frameRate);
    renderer.render(scene, camera);
}
//# sourceMappingURL=app.js.map