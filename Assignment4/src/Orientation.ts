
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