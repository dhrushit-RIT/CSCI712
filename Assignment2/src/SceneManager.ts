class SceneManager {
	private scene: THREE.Scene;
	private table: Table;
	private balls: Ball[] = [];
	static BALL_DIM_FT = 0.0859375;

	static ELASTICITY_BALL_BALL = 1;
	static ELASTICITY_BALL_CUSHION = 1;

	constructor(scene: THREE.Scene) {
		this.scene = scene;

		this.table = this.createTable();
		const ball = new Ball();
		this.balls.push(ball);

		//
		// add things to scene
		//
		scene.add(this.table);
		for (let ball of this.balls) {
			scene.add(ball);
		}

		// set the table initial position
		this.table.position.x = 0;
		this.table.position.y = -0.1;
		this.table.position.z = 0;

		// set the ball initial position
		ball.position.x = 0; // -Table.TABLE_LENGTH / 2;
		ball.position.y = 0;
		ball.position.z = 0;

		scene.add(new THREE.BoxHelper(ball));
	}

	createTable(): Table {
		const materials: THREE.MeshBasicMaterial[] = [
			new THREE.MeshBasicMaterial({ color: 0xff0000 }),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
			new THREE.MeshBasicMaterial({ color: 0x0000ff }),
			new THREE.MeshBasicMaterial({ color: 0xff00ff }),
			new THREE.MeshBasicMaterial({ color: 0xffff00 }),
			new THREE.MeshBasicMaterial({ color: 0x00ffff }),
		];
		return new Table(materials);
	}

	detectBallsCollision(): Boolean {
		for (let i = 0; i < this.balls.length; i++) {
			for (let j = i + 1; j < this.balls.length; j++) {
				const ball1 = this.balls[i];
				const ball2 = this.balls[j];

				// ball1.geometry.computeBoundingBox();
				// ball2.geometry.computeBoundingBox();

				const ball1BB = this.balls[i].geometry.boundingBox;
				const ball2BB = this.balls[j].geometry.boundingBox;
				if (ball1BB.intersectsBox(ball2BB)) {
					// calculate the impulse forces on each ball
					// J = (-(v1 - v2)_before * (e + 1)) / (1/m1 + 1/m2)
					const ball1Vel = ball1.getVelocity().clone();
					const ball2Vel = ball2.getVelocity().clone();
					const ball1Mass = ball1.getMass();
					const ball2Mass = ball2.getMass();
					const impulse = ball1Vel
						.sub(ball2Vel)
						.multiplyScalar(-1 * (1 + SceneManager.ELASTICITY_BALL_BALL))
						.multiplyScalar((ball1Mass * ball2Mass) / (ball1Mass + ball2Mass));

					const vecB1ToB2 = ball2
						.getPosition()
						.clone()
						.sub(ball1.getPosition());
					const vecB2ToB1 = ball1
						.getPosition()
						.clone()
						.sub(ball2.getPosition());

					const magImpulseOnNormal = impulse.dot(vecB2ToB1);
					const impulseOnB1 = vecB2ToB1
						.normalize()
						.multiplyScalar(magImpulseOnNormal);
					const impulseOnB2 = vecB1ToB2
						.normalize()
						.multiplyScalar(magImpulseOnNormal);

					ball1.applyImpulse(impulseOnB1);
					ball2.applyImpulse(impulseOnB2);

					// apply the impulse

					return true;
				}
			}
		}
		return false;
	}

	detectBallCushionCollision(): Boolean {
		for (let ball of this.balls) {
			// ball.geometry.computeBoundingBox();

			this.table.checkCollisionWithCushion(ball);
		}

		return false;
	}

	detectCollision(): Boolean {
		return this.detectBallsCollision() || this.detectBallCushionCollision();
	}

	handleCollision(collidingObjects: THREE.Mesh[]) {}

	myUpdate(elapsedTime: number) {
		for (let ball of this.balls) {
			ball.myUpdate(elapsedTime);
			// ball.geometry.computeBoundingBox();
		}

		this.detectCollision();
	}
}
