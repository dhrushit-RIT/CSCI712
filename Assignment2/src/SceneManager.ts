class SceneManager {
	private scene: THREE.Scene;
	private table: Table;
	private balls: Ball[] = [];
	static BALL_DIM_FT = 0.0859375;

	static ELASTICITY_BALL_BALL = 1;
	static ELASTICITY_BALL_CUSHION = 0.9;

	static COEFF_FRIC_BALL_SURFACE = 0.1;

	static GRAVITY = 9.8; // N/m^2

	static MIN_DELTA_T = 0.016;

	private simulate = true;

	private u = 0;

	static collisionTracker: { [key: string]: Set<Ball | TableCushion> } = {};

	constructor(scene: THREE.Scene) {
		this.scene = scene;

		//
		// add things to scene
		//
		this.createTable(scene, new THREE.Vector3(0, -0.1, 0));
		this.addBall(
			"ball0",
			scene,
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(6, 0, 0)
		);
		this.addBall(
			"ball1",
			scene,
			new THREE.Vector3(Table.TABLE_WIDTH / 4, 0, 0),
			new THREE.Vector3(0, 0, 0)
		);
		this.addBall(
			"ball2",
			scene,
			new THREE.Vector3(
				Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414,
				0,
				Ball.BALL_RADIUS * 1.414
			),
			new THREE.Vector3(0, 0, 0)
		);
		this.addBall(
			"ball3",
			scene,
			new THREE.Vector3(
				Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414,
				0,
				-Ball.BALL_RADIUS * 1.414
			),
			new THREE.Vector3(0, 0, 0)
		);

		for (let ball of this.balls) {
			SceneManager.collisionTracker[ball.getBallName()] = new Set();
		}
	}

	resetSceneAndRun() {
		this.balls[0].setPosition(new THREE.Vector3(0, 0, 0));
		this.balls[1].setPosition(new THREE.Vector3(Table.TABLE_WIDTH / 4, 0, 0));
		this.balls[2].setPosition(
			new THREE.Vector3(
				Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414,
				0,
				Ball.BALL_RADIUS * 1.414
			)
		);
		this.balls[3].setPosition(
			new THREE.Vector3(
				Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414,
				0,
				-Ball.BALL_RADIUS * 1.414
			)
		);
		this.balls[0].setVelocity(new THREE.Vector3(6, 0, 0));
		this.balls[1].setVelocity(new THREE.Vector3(0, 0, 0));
		this.balls[2].setVelocity(new THREE.Vector3(0, 0, 0));
		this.balls[3].setVelocity(new THREE.Vector3(0, 0, 0));
	}

	addBall(
		name: string,
		scene: THREE.Scene,
		initPos: THREE.Vector3,
		initVel: THREE.Vector3
	): void {
		const ball = new Ball(name);
		ball.position.set(initPos.x, initPos.y, initPos.z);
		ball.setVelocity(initVel);
		scene.add(ball);
		this.balls.push(ball);
	}

	createTable(scene: THREE.Scene, initPos: THREE.Vector3): void {
		const materials: THREE.MeshBasicMaterial[] = [
			new THREE.MeshBasicMaterial({ color: 0xff0000 }),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
			new THREE.MeshBasicMaterial({ color: 0x0000ff }),
			new THREE.MeshBasicMaterial({ color: 0xff00ff }),
			new THREE.MeshBasicMaterial({ color: 0xffff00 }),
			new THREE.MeshBasicMaterial({ color: 0x00ffff }),
		];

		this.table = new Table(materials);
		this.table.position.set(initPos.x, initPos.y, initPos.z);
		scene.add(this.table);
	}

	detectBallsCollision(): void {
		for (let i = 0; i < this.balls.length; i++) {
			for (let j = i + 1; j < this.balls.length; j++) {
				const ball1 = this.balls[i];
				const ball2 = this.balls[j];

				const ball1BB = this.balls[i].geometry.boundingSphere.clone();
				const ball2BB = this.balls[j].geometry.boundingSphere.clone();
				// let ball1BB = this.balls[i].geometry.boundingBox.clone();
				// let ball2BB = this.balls[j].geometry.boundingBox.clone();

				let ball1BBWorld = ball1BB.applyMatrix4(ball1.matrixWorld);
				let ball2BBWorld = ball2BB.applyMatrix4(ball2.matrixWorld);
				// if (ball1BBWorld.intersectsBox(ball2BBWorld)) {
				// Use the ball dist for intersection
				const dist = ball1.position.clone().sub(ball2.position).length();
				if (dist < 2 * Ball.BALL_RADIUS) {
					// if (ball1BBWorld.intersectsSphere(ball2BBWorld)) {
					// SceneManager.collisionTracker[ball1.getBallName()].add(ball2);
					// SceneManager.collisionTracker[ball2.getBallName()].add(ball1);
					// calculate the impulse forces on each ball
					// J = (-(v1 - v2)_before * (e + 1)) / (1/m1 + 1/m2)
					const ball1Vel = ball1.getVelocity().clone();
					const ball2Vel = ball2.getVelocity().clone();

					const ball1Mass = ball1.getMass();
					const ball2Mass = ball2.getMass();
					const impulse = ball1Vel
						.sub(ball2Vel)
						.multiplyScalar(1 + SceneManager.ELASTICITY_BALL_BALL)
						.multiplyScalar((ball1Mass * ball2Mass) / (ball1Mass + ball2Mass));

					// console.log(
					// 	"impulse " + impulse.x + " " + impulse.y + " " + impulse.z
					// );
					const vecB1ToB2 = ball2
						.getPosition()
						.clone()
						.sub(ball1.getPosition())
						.normalize();
					const vecB2ToB1 = ball1
						.getPosition()
						.clone()
						.sub(ball2.getPosition())
						.normalize();

					const magImpulseOnNormal = Math.abs(impulse.dot(vecB2ToB1));
					console.log(
						ball1.getBallName() +
							" collided " +
							ball2.getBallName() +
							" impulse along normal " +
							magImpulseOnNormal
					);
					const impulseOnB1 = vecB2ToB1
						.normalize()
						.setLength(magImpulseOnNormal);
					const impulseOnB2 = vecB1ToB2
						.normalize()
						.setLength(magImpulseOnNormal);

					// while (ball1BBWorld.intersectsBox(ball2BBWorld)) {
					const distB1B2 = ball1.position.clone().sub(ball2.position).length();
					const moveDist = 2 * Ball.BALL_RADIUS - distB1B2;

					const B1ToB2 = ball2.position.clone().sub(ball1.position).normalize();
					const B2ToB1 = ball1.position.clone().sub(ball2.position).normalize();
					const ball1Pos = ball1.position
						.clone()
						.add(B2ToB1.setLength(moveDist / 2));
					const ball2Pos = ball2.position
						.clone()
						.add(B1ToB2.setLength(moveDist / 2));
					ball1.setPosition(ball1Pos);
					ball2.setPosition(ball2Pos);

					// ball1.goBack();
					// ball2.goBack();

					// ball1BB = this.balls[i].geometry.boundingBox.clone();
					// ball2BB = this.balls[j].geometry.boundingBox.clone();

					// ball1BBWorld = ball1BB.applyMatrix4(ball1.matrixWorld);
					// ball2BBWorld = ball2BB.applyMatrix4(ball2.matrixWorld);
					// if (ball1BBWorld.intersectsBox(ball2BBWorld)) {
					// 	// while (ball1BBWorld.intersectsBox(ball2BBWorld)) {
					// 	ball1.goBack();
					// 	// ball2.goBack();
					// 	ball1BB = this.balls[i].geometry.boundingBox.clone();
					// 	ball2BB = this.balls[j].geometry.boundingBox.clone();

					// 	ball1BBWorld = ball1BB.applyMatrix4(ball1.matrixWorld);
					// 	ball2BBWorld = ball2BB.applyMatrix4(ball2.matrixWorld);
					// 	// }
					// }
					// }

					// // set the magnitude to 0 if the v1 is has no component along v2 - v1
					// // and v2 has no component along v1 - v2

					// if (
					// 	(ball1Vel.length() != 0 && ball1Vel.clone().dot(vecB1ToB2) == 0) ||
					// 	(ball2Vel.length() != 0 && ball2Vel.clone().dot(vecB2ToB1) == 0)
					// ) {
					// 	continue;
					// }
					// apply the impulse
					ball1.applyImpulse(impulseOnB1);
					ball2.applyImpulse(impulseOnB2);
					// if (impulseOnB1.length() > 3 || impulseOnB2.length() > 3) {
					// 	debugger;
					// }
					// if (
					// 	ball1.getBallName() == "ball0" &&
					// 	ball2.getBallName() == "ball1"
					// ) {
					// 	debugger;
					// }
					// console.log(
					// 	"impulse on ball 1 " +
					// 		impulseOnB1.x +
					// 		" " +
					// 		impulseOnB1.y +
					// 		" " +
					// 		impulseOnB1.z
					// );
					// console.log(
					// 	"impulse on ball 2 " +
					// 		impulseOnB2.x +
					// 		" " +
					// 		impulseOnB2.y +
					// 		" " +
					// 		impulseOnB2.z
					// );
				}
			}
		}
	}

	detectBallCushionCollision(): void {
		for (let ball of this.balls) {
			// ball.geometry.computeBoundingBox();

			this.table.checkCollisionWithCushion(ball);
		}
	}

	detectCollision(): void {
		this.detectBallCushionCollision();
		this.detectBallsCollision();
	}

	handleCollision(collidingObjects: THREE.Mesh[]) {}

	applyFriction(): void {
		for (let ball of this.balls) {
			ball.applyFriction();
		}
	}

	printTracker(): void {
		for (let key in SceneManager.collisionTracker) {
			console.log(SceneManager.collisionTracker[key]);
		}
		SceneManager.collisionTracker = {};
		for (let ball of this.balls) {
			SceneManager.collisionTracker[ball.getBallName()] = new Set();
		}
	}

	myUpdate(elapsedTime: number) {
		// if (elapsedTime > 3) {
		// 	debugger;
		// }
		this.applyFriction();
		if (this.simulate) {
			elapsedTime = this.u;
			this.u += SceneManager.MIN_DELTA_T / 2;
		}

		// if (elapsedTime < 2) {
		for (let ball of this.balls) {
			ball.myUpdate(elapsedTime);
		}
		// }

		this.detectCollision();
		console.log("collision tracker");
		// this.printTracker();
	}
}
