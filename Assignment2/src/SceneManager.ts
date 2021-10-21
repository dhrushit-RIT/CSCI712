class SceneManager {
	private scene: THREE.Scene;
	private table: Table;
	private balls: Ball[] = [];
	static BALL_DIM_FT = 0.0859375;

	static ELASTICITY_BALL_BALL = 1;
	static ELASTICITY_BALL_CUSHION = 1;

	constructor(scene: THREE.Scene) {
		this.scene = scene;

		//
		// add things to scene
		//
		this.createTable(scene, new THREE.Vector3(0, -0.1, 0));
		this.addBall(scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 0, 0));
		this.addBall(scene, new THREE.Vector3(Table.TABLE_WIDTH/4, 0, 0), new THREE.Vector3(0, 0, 0));
	}

	addBall(
		scene: THREE.Scene,
		initPos: THREE.Vector3,
		initVel: THREE.Vector3
	): void {
		const ball = new Ball();
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

				const ball1BB = this.balls[i].geometry.boundingBox.clone();
				const ball2BB = this.balls[j].geometry.boundingBox.clone();

				const ball1BBWorld = ball1BB.applyMatrix4(ball1.matrixWorld);
				const ball2BBWorld = ball2BB.applyMatrix4(ball2.matrixWorld);
				if (ball1BBWorld.intersectsBox(ball2BBWorld)) {
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

					console.log(
						"impulse " + impulse.x + " " + impulse.y + " " + impulse.z
					);
					const vecB1ToB2 = ball2
						.getPosition()
						.clone()
						.sub(ball1.getPosition());
					const vecB2ToB1 = ball1
						.getPosition()
						.clone()
						.sub(ball2.getPosition());

					const magImpulseOnNormal = Math.abs(impulse.dot(vecB2ToB1));
					const impulseOnB1 = vecB2ToB1
						.normalize()
						.multiplyScalar(magImpulseOnNormal);
					const impulseOnB2 = vecB1ToB2
						.normalize()
						.multiplyScalar(magImpulseOnNormal);

					// apply the impulse
					ball1.applyImpulse(impulseOnB1);
					ball2.applyImpulse(impulseOnB2);
					console.log(
						"impulse on ball 1 " +
							impulseOnB1.x +
							" " +
							impulseOnB1.y +
							" " +
							impulseOnB1.z
					);
					console.log(
						"impulse on ball 2 " +
							impulseOnB2.x +
							" " +
							impulseOnB2.y +
							" " +
							impulseOnB2.z
					);
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

	myUpdate(elapsedTime: number) {
		for (let ball of this.balls) {
			ball.myUpdate(elapsedTime);
		}

		this.detectCollision();
	}
}
