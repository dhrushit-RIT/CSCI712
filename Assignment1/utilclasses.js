class Keyframe {
	time;
	pos;
	orientation;

	constructor(time, x, y, z, xa, ya, za, theeta) {
		this.time = time;
		this.pos = new Position(x, y, z);
		this.orientation = new Orientation(xa, ya, za, theeta);
	}

	static createFromString(kfString) {
		let WHITE_SPACE_RE = /[ ,]+/;
		let [t, x, y, z, xa, ya, za, theeta] = kfString.split(WHITE_SPACE_RE);

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
	previousKF = null;
	nextKF = null;
	keyframes = {};
	constructor(kfstring) {
		this.parseKFString(kfstring);
		this.previousKF = this.keyframes[0];
		this.nextKF = this.keyframes[1];
	}

	parseKFString(kfstring) {
		let kfArray = {};

		for (let kfstr of kfstring.split("\n")) {
			let WHITE_SPACE_RE = /[ ,]+/;
			let kf = Keyframe.createFromString(kfstr);
			this.keyframes[t] = kf;
		}
	}

	getKFAt(time) {
		return this.keyframes[index];
	}
}
