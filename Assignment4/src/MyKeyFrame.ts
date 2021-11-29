class MyKeyframe {
	// Attributes
	pos: Position;
	orientation: Orientation | null;
	quat: THREE.Quaternion | null;
	time: number;

	constructor(
		time: number,
		pos: Position,
		orientation: Orientation,
		quat: THREE.Quaternion | null
	) {
		this.time = time;
		this.pos = pos;
		if (orientation != null) {
			this.orientation = orientation;
			this.quat = new THREE.Quaternion();
			this.quat.setFromAxisAngle(
				new THREE.Vector3(orientation.xa, orientation.ya, orientation.za),
				toRadians(orientation.theeta)
			);
		} else {
			this.quat = new THREE.Quaternion().copy(quat);
		}
		this.quat.normalize();

		// if (xa != null && ya != null && za != null && theeta != null) {
		// 	this.orientation = new Orientation(xa, ya, za, theeta);
		// 	this.quat = new THREE.Quaternion();
		// 	this.quat.setFromAxisAngle(
		// 		new THREE.Vector3(xa, ya, za),
		// 		toRadians(theeta)
		// 	);
		// } else {
		// 	this.quat = new THREE.Quaternion().copy(quat);
		// }
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
			new Position(parseFloat(x), parseFloat(y), parseFloat(z)),
			new Orientation(
				parseFloat(xa),
				parseFloat(ya),
				parseFloat(za),
				parseFloat(theeta)
			),
			null
		);
	}
}
