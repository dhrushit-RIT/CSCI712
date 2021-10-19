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
	private angacceleration: number;
	private lastTime: number;
	static BALL_RADIUS = 0.0859375;

	constructor() {
		const geometry_ball = new THREE.SphereGeometry(Ball.BALL_RADIUS, 32, 32);
		const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });

		super(geometry_ball, material_ball);
		this.lastTime = 0;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.forceOnBall = new THREE.Vector3(0, 0, 0);
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

	getPosition(pos: THREE.Vector3) {
		return this.position;
	}

	getVelocity(vel: THREE.Vector3) {
		return this.velocity;
	}

	getAcceleration(acc: THREE.Vector3) {
		return this.acceleration;
	}

	myUpdate(time: number) {
		this.updateMatrix();
		this.updateMatrixWorld(true);

		this.updatePosition(time - this.lastTime);
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

	updateAcceleration(deltaT: number) {
		this.acceleration.add(
			this.forceOnBall.clone().multiplyScalar(1 / this.mass)
		);
	}

	exertForce() {}
}

interface IBall {
	exertForce(): void;
}
