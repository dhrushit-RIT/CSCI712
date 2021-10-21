class Ball extends THREE.Mesh {
	private radius: number;
	private velocity: THREE.Vector3;
	private angvelocity: number;
	private forceOnBall: THREE.Vector3;
	private rotation_deg: number;
	private frictional_coeff: number;
	private momentum: number;
	private angularmoment: number;
	private mass: number;
	private acceleration: THREE.Vector3;
	private impulsiveAcceleration: THREE.Vector3;
	private angacceleration: number;
	private lastTime: number;
	static BALL_RADIUS = 0.0859375;
	private lastDeltaT: number;

	constructor() {
		const geometry_ball = new THREE.SphereGeometry(Ball.BALL_RADIUS, 32, 32);
		const material_ball = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });

		super(geometry_ball, material_ball);
		this.lastTime = 0;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.impulsiveAcceleration = new THREE.Vector3(0, 0, 0);
		this.forceOnBall = new THREE.Vector3(0, 0, 0);
		this.mass = 1;

		this.geometry.computeBoundingBox();
	}

	setPosition(pos: THREE.Vector3) {
		this.position.set(pos.x, pos.y, pos.z);
	}

	setVelocity(vel: THREE.Vector3) {
		this.velocity.set(vel.x, vel.y, vel.z);
	}

	setAcceleration(acc: THREE.Vector3) {
		this.acceleration.set(acc.x, acc.y, acc.z);
	}

	getPosition() {
		return this.position;
	}

	getVelocity() {
		return this.velocity;
	}

	getAcceleration() {
		return this.acceleration;
	}

	getMass(): number {
		return this.mass;
	}

	myUpdate(time: number) {
		this.updateMatrix();
		this.updateMatrixWorld(true);

		const deltaT = time - this.lastTime;
		this.updatePosition(deltaT);
		this.updateVelocity(deltaT);
		// this.updateAcceleration();

		this.lastTime = time;
		this.lastDeltaT = deltaT;
	}

	updatePosition(deltaT: number) {
		// add displacement due to velocity
		this.position.add(this.velocity.clone().multiplyScalar(deltaT));
		// add displacement due to acceleration
		this.position.add(
			this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT)
		);
	}

	updateVelocity(deltaT: number) {
		this.velocity.add(this.acceleration.clone().multiplyScalar(deltaT));
	}

	updateAcceleration() {
		this.acceleration.add(
			this.forceOnBall.clone().multiplyScalar(1 / this.mass)
		);
	}

	applyForce(force: THREE.Vector3) {
		this.forceOnBall = force;
		this.updateAcceleration();
		this.forceOnBall.set(0, 0, 0);
	}

	applyImpulse(impulse: THREE.Vector3) {
		this.velocity.add(impulse.multiplyScalar(1 / this.mass));
		console.log(
			"velocity after impulse " +
				this.velocity.x +
				" " +
				this.velocity.y +
				" " +
				this.velocity.z
		);
	}

	goBack(): void {
		// add displacement due to velocity
		this.position.add(
			this.velocity.clone().multiplyScalar(-2 * this.lastDeltaT)
		);
		// add displacement due to acceleration
		this.position.add(
			this.acceleration
				.clone()
				.multiplyScalar(0.5 * this.lastDeltaT * this.lastDeltaT)
		);
	}
}

interface IBall {
	applyForce(): void;
}
