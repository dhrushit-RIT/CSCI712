// DAT.GUI

class CRAnimator {
	private currentKFIndex: number;
	private nextKFIndex: number;
	private currentKF: MyKeyframe = null;
	private nextKF: MyKeyframe = null;
	private keyframes: MyKeyframe[] = [];
	private endTime: number;
	private u: number = 0;
	private controlSpeed = 0.02;
	private simulate: boolean = false;
	private totalKFs = -1;
	private basisMatrix = new THREE.Matrix4();

	// Catmul Rom stuff
	private startFrame: MyKeyframe;
	private endFrame: MyKeyframe;

	constructor(kfstring: string) {
		this.parseKFString(kfstring);
		this.currentKF = this.keyframes[0];
		if (this.keyframes.length > 1) {
			this.nextKF = this.keyframes[1];
		} else {
			this.nextKF = this.currentKF;
		}
		this.currentKFIndex = 0;
		this.nextKFIndex = 1;

		this.u = -this.controlSpeed;

		this.endTime = this.keyframes[this.keyframes.length - 1].time;
		console.log("end time: " + this.endTime);

		this.startFrame = this.computeStartFrame();
		this.endFrame = this.computeEndFrame();

		// prettier-ignore
		this.basisMatrix.set(
			-0.5, 1.5, -1.5,  0.5, 
			1,   -2.5,    2, -0.5, 
			-0.5,   0,  0.5,    0, 
			0,      1,    0,    0
		);
	}

	private computeStartFrame() {
		return new MyKeyframe(
			-this.keyframes[1].time,
			Position.difference(this.keyframes[1].pos, this.keyframes[0].pos),
			this.keyframes[0].orientation,
			null
		);
	}

	private computeEndFrame() {
		return new MyKeyframe(
			2 * this.keyframes[this.totalKFs - 1].time -
				this.keyframes[this.totalKFs - 2].time,
			Position.add(
				Position.difference(
					this.keyframes[this.totalKFs - 2].pos,
					this.keyframes[this.totalKFs - 1].pos
				),
				this.keyframes[this.totalKFs - 1].pos
			),
			this.keyframes[this.totalKFs - 1].orientation,
			null
		);
	}

	parseKFString(kfstring: string) {
		let kfArray: MyKeyframe[] = [];

		for (let kfstr of kfstring.split("\n")) {
			let kf = MyKeyframe.createFromString(kfstr);
			this.keyframes.push(kf);
		}
		this.totalKFs = this.keyframes.length;
	}

	interpolateLinear(numInitial: number, numFinal: number, u: number) {
		return (1 - u) * numInitial + u * numFinal;
	}

	computeControlVariable(time: number) {
		if (this.simulate) {
			this.u += this.controlSpeed;
		} else {
			// conmpute from times of the two frames
			let timeElapsedFromCurrentKF = time - this.currentKF.time;
			let timeDiff = this.nextKF.time - this.currentKF.time;
			this.u = timeElapsedFromCurrentKF / timeDiff;
		}
		this.u = Math.min(this.u, 1);
	}

	incrementIndices() {
		if (this.nextKFIndex < this.keyframes.length - 1) {
			if (this.nextKFIndex == 0) {
				this.currentKFIndex = -1;
			}
			this.currentKFIndex += 1;
			this.nextKFIndex += 1;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		} else if (this.simulate) {
			this.currentKFIndex = this.nextKFIndex;

			this.nextKFIndex = 0;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}
	}

	updateFrames(time: number) {
		if (this.simulate) {
			if (this.u >= 1) {
				this.incrementIndices();
				this.u = 0;
			}
		} else {
			if (time < this.endTime && time > this.nextKF.time) {
				this.incrementIndices();
				this.u = 0;
			}
		}
	}

	interpolateCatmulRom(): Position {
		let p1: Position, p2: Position, p3: Position, p4: Position;

		if (this.keyframes.length < 3) {
			// p1 = this.keyframes[0].pos;
			p1 = this.startFrame.pos;
			p2 = this.keyframes[0].pos;
			p3 = this.keyframes[1].pos;
			// p4 = this.keyframes[1].pos;
			p4 = this.endFrame.pos;
		} else if (this.currentKFIndex == 0) {
			p1 = this.startFrame.pos;
			p2 = this.keyframes[0].pos;
			p3 = this.keyframes[1].pos;
			p4 = this.keyframes[2].pos;
		} else if (this.nextKFIndex == this.keyframes.length - 1) {
			p1 = this.keyframes[this.totalKFs - 3].pos;
			p2 = this.keyframes[this.totalKFs - 2].pos;
			p3 = this.keyframes[this.totalKFs - 1].pos;
			p4 = this.endFrame.pos;
		} else {
			p1 = this.keyframes[this.currentKFIndex - 1].pos;
			p2 = this.keyframes[this.currentKFIndex].pos;
			p3 = this.keyframes[this.nextKFIndex].pos;
			p4 = this.keyframes[this.nextKFIndex + 1].pos;
		}

		let uW = 1;
		let uZ = uW * this.u;
		let uY = uZ * this.u;
		let uX = uY * this.u;
		let U: THREE.Vector4 = new THREE.Vector4(uX, uY, uZ, uW);

		let controlMatrix: THREE.Matrix4 = new THREE.Matrix4();
		// prettier-ignore
		controlMatrix.set(
			p1.x, p1.y, p1.z, 0,
			p2.x, p2.y, p2.z, 0,
			p3.x, p3.y, p3.z, 0,
			p4.x, p4.y, p4.z, 0
		);

		const catmulProduct = new THREE.Matrix4();
		catmulProduct.multiplyMatrices(this.basisMatrix, controlMatrix);
		console.log(catmulProduct);
		catmulProduct.transpose();
		U.applyMatrix4(catmulProduct);
		return new Position(
			U.getComponent(0),
			U.getComponent(1),
			U.getComponent(2)
		);
	}

	getKFAt(time: number): MyKeyframe {
		// return this.keyframes[0];

		this.updateFrames(time);
		this.computeControlVariable(time);
		console.log(this.u);

		//
		// interpolate position
		//
		let initialPosition: Position = this.currentKF.pos;
		let finalPosition: Position = this.nextKF.pos;
		let currentPosition: Position = this.interpolateCatmulRom();
		// currentPosition.set();
		// console.log(this.u);
		//
		// interpolate orientation
		//
		// console.log(currentPosition);
		let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);
		let qFinal = this.nextKF.quat;
		// qInitial.slerp(qFinal, u);
		let currentQuat = new THREE.Quaternion(); //.copy(qInitial);
		qInitial.slerp(qFinal, this.u);
		qInitial.normalize();
		// currentQuat.slerpQuaternions(qInitial, qFinal, this.u);
		// console.log(timeElapsedFromCurrentKF, this.currentKF.orientation.theeta, currentQuat);
		return new MyKeyframe(
			this.nextKF.time,
			new Position(currentPosition.x, currentPosition.y, currentPosition.z),
			null,
			qInitial
		);
	}

	resetFrames() {
		if (!this.simulate) {
			this.currentKFIndex = 0;
			this.nextKFIndex = 1;

			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}
	}
}
