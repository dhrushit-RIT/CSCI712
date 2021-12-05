// init scene
const scene = new THREE.Scene();
const cnv = document.getElementById("c");
// init renderer
const side = window.innerWidth;
const renderer = new THREE.WebGLRenderer({ canvas: cnv });
// renderer.setSize(side, side);
var handle: any;
// handling files
const fileInput = document.getElementById("formFile");
fileInput.addEventListener("change", handleFiles, false);

// set up camera
let fieldOfView = 45,
	aspectRatio = 4 / 3,
	near = 0.1,
	far = 1000;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshBasicMaterial({
	vertexColors: false,
});

const sceneManager = new SceneManager(scene);

// set up camera
camera.position.set(300, 300, 300);
camera.lookAt(0, 100, 0);

scene.add(camera);

const clock = new THREE.Clock();

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

var threeSkeleton: Joint = null;

function makeSkeleton(skeletonStructure: any) {
	console.log({ skeletonStructure });
}

function parseFrames(motionData: any) {
	let lines = motionData.split("\n").map((item: any) => item.trim());
	let numframes = parseInt(lines[1].split("\t")[1]);
	let frameRate = parseFloat(lines[2].split("\t")[1]);
	let frames: {}[] = [];
	let frameLines = lines.slice(3);
	for (let line of frameLines) {
		let frameInfo: any = {};
		let parts = line.split("\t").map((item: any) => parseFloat(item));
		let start = 0;
		for (let part of skeletonStructure.partsSequenceForOffset) {
			let partInfo: any = {};
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
	// let parts = line.split(/\s/).map((item) => item.trim());
}

var motionDataInfo: {
	numframes: number;
	frames: {}[];
	frameRate: number;
};
var skeletonStructure: {
	skeletonParts: {
		[key: string]: {
			channels: string[];
			numChannels: number;
			offset: { x: number; y: number; z: number };
			children: any;
		};
	};
	threeSkeletonParts: { [key: string]: Joint };
	partsSequenceForOffset: string[];
	threeRoot: Joint;
};

function addPlatform() {
	const geometry = new THREE.BoxGeometry(500, 0.5, 500);
	const material = new THREE.MeshBasicMaterial({ color: 0x8800ff });
	const cube = new THREE.Mesh(geometry, material);

	scene.add(cube);
}

function parseFileContent(inputText: string) {
	let [header, motionData] = inputText.split("MOTION");
	skeletonStructure = parseStructure(header);
	threeSkeleton = skeletonStructure["threeRoot"];
	scene.clear();
	if (handle) cancelAnimationFrame(handle);
	frameIndex = 0;
	scene.add(threeSkeleton);
	console.log(threeSkeleton);

	motionDataInfo = parseFrames(motionData);
	addPlatform();
	animate();

	// let parts = inputText.split("\n");
	// for (let partsidx = 0; partsidx < parts.length; partsidx++) {
	// 	parts[partsidx] = parts[partsidx].trim();
	// }
	// console.log(parts);
}

function afterFileLoads(fileContentText: string) {
	parseFileContent(fileContentText);
}

//
// render
//
// const canvas = renderer.domElement;
let endTimeFactor = 1;
var frameIndex = 0;
function animate() {
	handle = requestAnimationFrame(animate);
	// sceneManager.myUpdate(clock.getElapsedTime());
	frameIndex += 1;
	frameIndex %= motionDataInfo.numframes;
	const skeletonInfo: any = motionDataInfo.frames[frameIndex];
	for (let part in skeletonInfo) {
		skeletonStructure.threeSkeletonParts[part].setFromFrameInfo(
			skeletonInfo[part]
		);
	}
	renderer.render(scene, camera);
}

// animate();
