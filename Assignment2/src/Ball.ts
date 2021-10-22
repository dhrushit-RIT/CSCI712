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
	private weight: number;
	private ballname: string;
	private ignoreImpulse: Boolean;
	private ignoreCount: number;
	private static IGNORE_COUNT_MAX = 3;

	private collisionHandled: boolean;

	constructor(ballname: string) {
		const geometry_ball = new THREE.SphereGeometry(Ball.BALL_RADIUS, 32, 32);
		const material_ball = new THREE.MeshBasicMaterial({
			color: Math.random() * 0xffffff,
		});

		super(geometry_ball, material_ball);
		this.lastTime = 0;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.impulsiveAcceleration = new THREE.Vector3(0, 0, 0);
		this.forceOnBall = new THREE.Vector3(0, 0, 0);
		this.mass = 1;
		this.weight = this.mass * SceneManager.GRAVITY;
		this.lastDeltaT = SceneManager.MIN_DELTA_T;
		this.collisionHandled = true;
		this.geometry.computeBoundingBox();
		this.ballname = ballname;
		this.ignoreImpulse = false;
		this.ignoreCount = 0;
	}

	getBallName(): string {
		return this.ballname;
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

	getWeight(): number {
		return this.weight;
	}

	myUpdate(time: number) {
		this.updateMatrix();
		this.updateMatrixWorld(true);

		const deltaT = time - this.lastTime;
		this.updatePosition(deltaT);
		this.updateVelocity(deltaT);
		this.updateAcceleration();

		this.lastTime = time;
		this.lastDeltaT = deltaT;

		console.log(
			this.ballname +
				" " +
				this.velocity.x +
				" " +
				this.velocity.y +
				" " +
				this.velocity.z
		);
	}

	updatePosition(deltaT: number) {
		// add displacement due to velocity
		this.position.add(this.velocity.clone().multiplyScalar(deltaT));
		// add displacement due to acceleration
		this.position.add(
			this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT)
		);

		if (!this.collisionHandled) {
			// add displacement due to velocity
			this.position.add(this.velocity.clone().multiplyScalar(deltaT));
			// add displacement due to acceleration
			this.position.add(
				this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT)
			);
			this.collisionHandled = true;
		}
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

	applyImpulsiveForce(force: THREE.Vector3) {
		const impulse = force.multiplyScalar(this.lastDeltaT);
		this.applyImpulse(impulse);
	}

	applyImpulse(impulse: THREE.Vector3) {
		if (this.ignoreImpulse) {
			this.ignoreCount += 1;

			if (this.ignoreCount > Ball.IGNORE_COUNT_MAX) {
				this.ignoreImpulse = false;
				this.ignoreCount = 0;
			}
		}
		if (!this.ignoreImpulse) {
			this.collisionHandled = false;
			this.velocity.add(impulse.multiplyScalar(1 / this.mass));
		}
		// console.log(
		// 	"velocity after impulse " +
		// 		this.velocity.x +
		// 		" " +
		// 		this.velocity.y +
		// 		" " +
		// 		this.velocity.z
		// );
	}

	goBack(deltaT?: number): void {
		// add displacement due to velocity

		const dt = deltaT || this.lastDeltaT;
		this.position.add(this.velocity.clone().multiplyScalar(-2 * dt));
		// add displacement due to acceleration
		this.position.add(this.acceleration.clone().multiplyScalar(0.5 * dt * dt));
	}

	applyFriction(): void {
		const frictionForceMag = SceneManager.COEFF_FRIC_BALL_SURFACE * this.weight;
		const frictionalAccelerationMag = frictionForceMag / this.mass;
		const frictionalAccelerationDir = this.velocity
			.clone()
			.normalize()
			.multiplyScalar(-1);
		const frictionalAcceleration = frictionalAccelerationDir.setLength(
			frictionalAccelerationMag
		);
		const deltaTForZeroVelocity =
			this.velocity.length() / frictionalAccelerationMag;

		if (deltaTForZeroVelocity > SceneManager.MIN_DELTA_T) {
			this.velocity.add(frictionalAcceleration.multiplyScalar(this.lastDeltaT));
		} else {
			this.velocity.set(0, 0, 0);
		}
	}
}

interface IBall {
	applyForce(): void;
}
