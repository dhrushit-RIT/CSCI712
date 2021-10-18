class SceneManager {
	private scene: THREE.Scene;
	private table: Table;
	private balls: Ball[] = [];

	constructor(scene: THREE.Scene) {
		this.scene = scene;

		this.table = this.createTable();
		const ball = new Ball(BALL_DIM_FT);
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
		ball.position.x = 0;//-Table.TABLE_LENGTH / 2;
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
					return true;
				}
			}
		}
		return false;
	}

	detectBallCushionCollision(): Boolean {
		for (let ball of this.balls) {
			ball.geometry.computeBoundingBox();

			const ballBB = ball.geometry.boundingBox;

			if (this.table.checkCollisionWithCushion(ballBB)) {
				return true;
			}
		}

		return false;
	}

	detectCollision(): Boolean {
		return this.detectBallsCollision() || this.detectBallCushionCollision();
	}

	determineCollision(): THREE.Mesh[] {
		return [];
	}

	handleCollision(collidingObjects: THREE.Mesh[]) {}

	myUpdate() {
		for (let ball of this.balls) {
			ball.myUpdate();
			// ball.geometry.computeBoundingBox();
		}

		if (this.detectCollision()) {
			console.log("Collision Detected");
			const collidingOBjects = this.determineCollision();
			this.handleCollision(collidingOBjects);
		}
	}
}
