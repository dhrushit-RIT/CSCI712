class Position {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toString(): string {
		return "( " + this.x + " ," + this.y + " ," + this.z + " )";
	}
}

class Orientation {
	xa: number;
	ya: number;
	za: number;
	theeta: number;

	constructor(xa: number, ya: number, za: number, theeta: number) {
		this.xa = xa;
		this.ya = ya;
		this.za = za;
		this.theeta = theeta;
	}

	toString(): string {
		return (
			"[( " +
			this.xa +
			" ," +
			this.ya +
			" ," +
			this.za +
			" ), " +
			this.theeta +
			"]"
		);
	}
}

class MyKeyframe {
	// Attributes
	pos: Position;
	orientation: Orientation | null;
	quat: THREE.Quaternion | null;
	time: number;

	constructor(
		time: number,
		x: number,
		y: number,
		z: number,
		xa: number | null,
		ya: number | null,
		za: number | null,
		theeta: number | null,
		quat: THREE.Quaternion | null
	) {
		this.time = time;
		this.pos = new Position(x, y, z);
		if (xa != null && ya != null && za != null && theeta != null) {
			this.orientation = new Orientation(xa, ya, za, theeta);
			this.quat = new THREE.Quaternion();
			this.quat.setFromAxisAngle(new THREE.Vector3(xa, ya, za), theeta);
		} else {
			this.quat = new THREE.Quaternion().copy(quat);
		}
	}

	toString(): string {
		return this.time + " " + this.pos + " " + this.orientation;
	}

	getTime(): number {
		return this.time;
	}

	getPosition(): Position {
		return this.pos;
	}

	static createFromString(kfString: string) {
		let WHITE_SPACE_RE = /[ ,]+/;
		let [t, x, y, z, xa, ya, za, theeta] = kfString.split(WHITE_SPACE_RE);
		return new MyKeyframe(
			parseFloat(t),
			parseFloat(x),
			parseFloat(y),
			parseFloat(z),
			parseFloat(xa),
			parseFloat(ya),
			parseFloat(za),
			parseFloat(theeta),
			null
		);
	}
}

class KFAnimator {
	private currentKFIndex: number;
	private nextKFIndex: number;
	private currentKF: MyKeyframe = null;
	private nextKF: MyKeyframe = null;
	private keyframes: MyKeyframe[] = [];
	private endTime: number;
	private u: number = 0;
	private simulate: boolean = true;

	constructor(kfstring: string) {
		this.parseKFString(kfstring);
		this.currentKF = this.keyframes[0];
		this.nextKF = this.keyframes[1];
		this.currentKFIndex = 0;
		this.nextKFIndex = 1;

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

	getKFAt(time: number): MyKeyframe {
		// return this.keyframes[0];
		if (!this.simulate && time > this.endTime) {
			// return this.keyframes[this.keyframes.length - 1];
			return this.currentKF;
		}

		if (this.u >= 1 || (!this.simulate && time > this.nextKF.time)) {
			this.currentKFIndex += 1;
			this.nextKFIndex += 1;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}

		// if (this.keyframes.length >= this.nextKFIndex) {
		// 	this.currentKFIndex += this.keyframes.length - 1;
		// 	this.currentKF = this.keyframes[this.currentKFIndex];
		// }

		if (!this.simulate && this.currentKFIndex >= this.keyframes.length) {
			this.currentKFIndex = 0;
			this.nextKFIndex = 1;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}

		let timeElapsedFromCurrentKF = time - this.currentKF.time;
		let timeDiff = this.nextKF.time - this.currentKF.time;
		let u = timeElapsedFromCurrentKF / timeDiff;
		// console.log(u);
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
		this.u += 0.01;
		console.log(this.u);

		//
		// interpolate orientation
		//
		// let initialOrientation = this.currentKF.orientation;
		// let finalOrientation = this.nextKF.orientation;

		let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);

		let qFinal = this.nextKF.quat;
		// qInitial.slerp(qFinal, u);
		let currentQuat = new THREE.Quaternion()
			.copy(qInitial)
			.slerp(qFinal, this.u);
		// currentQuat.slerpQuaternions(qInitial, qFinal, this.u);
		// console.log(timeElapsedFromCurrentKF, this.currentKF.orientation.theeta, currentQuat);

		return new MyKeyframe(
			time,
			currentPosition.x,
			currentPosition.y,
			currentPosition.z,
			null,
			null,
			null,
			null,
			currentQuat
		);
	}
}