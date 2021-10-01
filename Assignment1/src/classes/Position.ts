class Position {
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	set(pos: Position): Position {
		return new Position(pos.x, pos.y, pos.z);
	}

	toString(): string {
		return "( " + this.x + " ," + this.y + " ," + this.z + " )";
	}

	public static difference(posInitial: Position, posFinal: Position): Position {
		return new Position(
			posFinal.x - posInitial.x,
			posFinal.y - posInitial.y,
			posFinal.z - posInitial.z
		);
	}

	public static add(posInitial: Position, posFinal: Position): Position {
		return new Position(
			posFinal.x + posInitial.x,
			posFinal.y + posInitial.y,
			posFinal.z + posInitial.z
		);
	}
}
