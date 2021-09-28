
class KFAnimator {
	private currentKFIndex: number;
	private nextKFIndex: number;
	private currentKF: MyKeyframe = null;
	private nextKF: MyKeyframe = null;
	private keyframes: MyKeyframe[] = [];
	private endTime: number;
	private u: number = 0;
	private controlSpeed = 0.05;
	private simulate: boolean = true;

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
	}

	parseKFString(kfstring: string) {
		let kfArray: MyKeyframe[] = [];

		for (let kfstr of kfstring.split("\n")) {
			let kf = MyKeyframe.createFromString(kfstr);
			this.keyframes.push(kf);
		}
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

	getKFAt(time: number): MyKeyframe {
		// return this.keyframes[0];

		this.updateFrames(time);
		this.computeControlVariable(time);

		//
		// interpolate position
		//
		let initialPosition: Position = this.currentKF.pos;
		let finalPosition: Position = this.nextKF.pos;
		let currentPosition: Position = new Position(
			this.interpolateLinear(initialPosition.x, finalPosition.x, this.u),
			this.interpolateLinear(initialPosition.y, finalPosition.y, this.u),
			this.interpolateLinear(initialPosition.z, finalPosition.z, this.u)
		);
		// console.log(this.u);
		//
		// interpolate orientation
		//
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
			currentPosition.x,
			currentPosition.y,
			currentPosition.z,
			null,
			null,
			null,
			null,
			qInitial
		);
	}
}
