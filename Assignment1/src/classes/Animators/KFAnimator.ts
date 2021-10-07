class KFAnimator {
	protected currentKFIndex: number;
	protected nextKFIndex: number;
	protected currentKF: MyKeyframe = null;
	protected nextKF: MyKeyframe = null;
	protected keyframes: MyKeyframe[] = [];
	protected endTime: number;
	protected u: number = 0;
	protected controlSpeed = 0.05;
	protected simulate: boolean = false;
	protected totalKFs = -1;
	protected mappedControlVariable = false;
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
	}

	parseKFString(kfstring: string) {
		let kfArray: MyKeyframe[] = [];

		for (let kfstr of kfstring.split("\n")) {
			let kf = MyKeyframe.createFromString(kfstr);
			this.keyframes.push(kf);
		}
		this.totalKFs = this.keyframes.length;
	}

	interpolatePosition(
		initialPosition: Position,
		finalPosition: Position,
		u: number
	) {
		return new Position(
			this.interpolateLinear(initialPosition.x, finalPosition.x, this.u),
			this.interpolateLinear(initialPosition.y, finalPosition.y, this.u),
			this.interpolateLinear(initialPosition.z, finalPosition.z, this.u)
		);
	}

	interpolateLinear(numInitial: number, numFinal: number, u: number) {
		return (1 - u) * numInitial + u * numFinal;
	}

	computeControlVariable(time: number) {
		if (this.simulate) {
			this.u += this.controlSpeed;
		} else if (this.mappedControlVariable) {
			let timeElapsedFromCurrentKF = time - this.currentKF.time;
			let timeDiff = this.nextKF.time - this.currentKF.time;
			this.u = this.sigmoid(timeElapsedFromCurrentKF / timeDiff);
			// this.u *= this.u;
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
		let currentPosition: Position = this.interpolatePosition(
			initialPosition,
			finalPosition,
			this.u
		);
		//
		// interpolate orientation
		//

		return new MyKeyframe(
			this.nextKF.time,
			new Position(currentPosition.x, currentPosition.y, currentPosition.z),
			null,
			this.interpolateOrientation(currentPosition)
		);
		// return this.interpolateOrientation(currentPosition);
	}

	interpolateOrientation(currentPosition: Position) {
		let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);
		let qFinal = this.nextKF.quat;
		let currentQuat = new THREE.Quaternion();
		qInitial.slerp(qFinal, this.u);
		qInitial.normalize();
		return qInitial;
	}

	resetFrames() {
		if (!this.simulate) {
			this.currentKFIndex = 0;
			this.nextKFIndex = 1;

			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}
	}

	setMappedControl(shouldMapU: boolean): void {
		this.mappedControlVariable = shouldMapU;
	}

	sigmoid(x: number): number {
		const z = 10 * Math.log(2 + Math.sqrt(3)) * (x - 0.4);
		return 1 / (1 + Math.exp(-z));
	}
}
