class Keyframe {
	time;
	pos;
	orientation;

	constructor(time, x, y, z, xa, ya, za, theeta) {
		this.time = time;
		this.pos = new Position(x, y, z);
		this.orientation = new Orientation(xa, ya, za, theeta);
	}

	getTime() {
		return this.time;
	}

	getPosition() {
		return this.pos;
	}

	static createFromString(kfString) {
		let WHITE_SPACE_RE = /[ ,]+/;
		let [t, x, y, z, xa, ya, za, theeta] = kfString.split(WHITE_SPACE_RE);
		debugger;
		return new Keyframe(
			parseFloat(t),
			parseFloat(x),
			parseFloat(y),
			parseFloat(z),
			parseFloat(xa),
			parseFloat(ya),
			parseFloat(za),
			parseFloat(theeta)
		);
	}
}

class Position {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Orientation {
	constructor(xa, ya, za, theeta) {
		this.xa = xa;
		this.ya = ya;
		this.za = za;
		this.theeta = theeta;
	}
}

class KFAnimator {
	currentKFIndex;
	nextKFIndex;
	currentKF = null;
	nextKF = null;
	keyframes = [];
	constructor(kfstring) {
		this.parseKFString(kfstring);
		this.currentKF = this.keyframes[0];
		this.nextKF = this.keyframes[1];
		this.currentKFIndex = 0;
		this.nextKFIndex = 1;
	}

	parseKFString(kfstring) {
		debugger;
		let kfArray = [];

		for (let kfstr of kfstring.split("\n")) {
			let kf = Keyframe.createFromString(kfstr);
			this.keyframes.push(kf);
		}
	}

	getKFAt(time) {
		if (time > this.nextKF.getTime()) {
			this.currentKFIndex += 1;
			this.nextKFIndex += 1;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}

		if (this.currentKFIndex >= this.keyframes.length) {
			this.currentKFIndex = 0;
			this.nextKFIndex = 1;
			this.currentKF = this.keyframes[this.currentKFIndex];
			this.nextKF = this.keyframes[this.nextKFIndex];
		}

		let timeElapsedFromCurrentKF = time - this.currentKF.time;
		let timeDiff = this.nextKF.time - this.currentKF.time;
		let u = timeElapsedFromCurrentKF / timeDiff;

		//
		// interpolate position
		//
		let initialPosition = this.currentKF.getPosition();
		let finalPosition = this.nextKF.getPosition();
		let currentPosition = new Position(
			(1 - u) * initialPosition.x + u * finalPosition.x,
			(1 - u) * initialPosition.y + u * finalPosition.y,
			(1 - u) * initialPosition.z + u * finalPosition.z
		);

		//
		// interpolate orientation
		//
		let initialOrientation = this.currentKF.orientation;

		return new Keyframe(
			time,
			currentPosition.x,
			currentPosition.y,
			currentPosition.z,
			initialOrientation.xa,
			initialOrientation.ya,
			initialOrientation.za,
			initialOrientation.theeta
		);
	}
}
