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
			this.quat.setFromAxisAngle(
				new THREE.Vector3(xa, ya, za),
				toRadians(theeta)
			);
		} else {
			this.quat = new THREE.Quaternion().copy(quat);
		}
		this.quat.normalize();
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
