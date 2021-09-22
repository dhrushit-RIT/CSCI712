class Keyframe {
	time;
	pos;
	rot;

	constructor(time, x, y, z, xa, ya, za, theeta) {
		this.time = time;
		this.pos = Position(x, y, z);
		this.rot = Rotation(xa, ya, za, theeta);
	}
}

class Position {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Rotation {
	constructor(xa, ya, za, theeta) {
		this.xa = xa;
		this.ya = ya;
		this.za = za;
		this.theeta = theeta;
	}
}
