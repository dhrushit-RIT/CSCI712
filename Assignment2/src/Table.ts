class Table extends THREE.Group {
	static TABLE_WIDTH = 6;
	static TABLE_LENGTH = 12;

	private frictionCoefficient = {
		ball: 0.3,
	};

	//			 	cushion 1
	//			 _________________
	//			 |				|
	//			 |				|
	//			 |				|
	//			 |				|
	//			 |				|		cushion 2
	// cushion 6 |				|
	//			 |				|
	//			 |				|
	//			 |				|
	//			 |				|		cushion 3
	// cushion 5 |				|
	//			 |				|
	//			 `````````````````
	// 				cushion 4

	private surface: THREE.Mesh;
	private cushion1: TableCushion;
	private cushion2: TableCushion;
	private cushion3: TableCushion;
	private cushion4: TableCushion;
	private cushion5: TableCushion;
	private cushion6: TableCushion;

	constructor(material: THREE.MeshBasicMaterial[]) {
		super();
		const surfaceGeometry = new THREE.BoxGeometry(
			Table.TABLE_LENGTH,
			0.1,
			Table.TABLE_WIDTH
		);
		const cushionGeometry = new THREE.BoxGeometry(Table.TABLE_WIDTH, 0.5, 0.1);
		this.surface = new THREE.Mesh(surfaceGeometry, material);
		this.cushion1 = new TableCushion(
			"cushion1",
			cushionGeometry,
			material,
			Table.TABLE_WIDTH,
			new THREE.Vector3(-1, 0, 0)
		);
		this.cushion2 = new TableCushion(
			"cushion2",
			cushionGeometry,
			material,
			Table.TABLE_LENGTH,
			new THREE.Vector3(0, 0, -1)
		);
		this.cushion3 = new TableCushion(
			"cushion3",
			cushionGeometry,
			material,
			Table.TABLE_WIDTH,
			new THREE.Vector3(0, 0, -1)
		);
		this.cushion4 = new TableCushion(
			"cushion4",
			cushionGeometry,
			material,
			Table.TABLE_LENGTH,
			new THREE.Vector3(1, 0, 0)
		);
		this.cushion5 = new TableCushion(
			"cushion5",
			cushionGeometry,
			material,
			Table.TABLE_LENGTH,
			new THREE.Vector3(0, 0, 1)
		);
		this.cushion6 = new TableCushion(
			"cushion6",
			cushionGeometry,
			material,
			Table.TABLE_LENGTH,
			new THREE.Vector3(0, 0, 1)
		);

		// this.cushion1.position.set(2, 2, 2);
		this.cushion1.rotateY(Math.PI / 2);
		this.cushion4.rotateY(Math.PI / 2);
		this.cushion1.position.setX(Table.TABLE_WIDTH);
		this.cushion4.position.setX(-Table.TABLE_WIDTH);

		this.cushion2.position.setX(Table.TABLE_WIDTH / 2);
		this.cushion2.position.setZ(Table.TABLE_WIDTH / 2);
		this.cushion3.position.setX(-Table.TABLE_WIDTH / 2);
		this.cushion3.position.setZ(Table.TABLE_WIDTH / 2);

		this.cushion5.position.setX(-Table.TABLE_WIDTH / 2);
		this.cushion5.position.setZ(-Table.TABLE_WIDTH / 2);
		this.cushion6.position.setX(Table.TABLE_WIDTH / 2);
		this.cushion6.position.setZ(-Table.TABLE_WIDTH / 2);

		this.cushion1.geometry.computeBoundingBox();
		this.cushion2.geometry.computeBoundingBox();
		this.cushion3.geometry.computeBoundingBox();
		this.cushion4.geometry.computeBoundingBox();
		this.cushion5.geometry.computeBoundingBox();
		this.cushion6.geometry.computeBoundingBox();

		this.add(this.surface);
		this.add(this.cushion1);
		this.add(this.cushion2);
		this.add(this.cushion3);
		this.add(this.cushion4);
		this.add(this.cushion5);
		this.add(this.cushion6);

		// this.add(new THREE.BoxHelper(this.cushion1, 0xffff00));
		// this.add(new THREE.BoxHelper(this.cushion2, 0xffff00));
		// this.add(new THREE.BoxHelper(this.cushion3, 0xffff00));
		// this.add(new THREE.BoxHelper(this.cushion4, 0xffff00));
		// this.add(new THREE.BoxHelper(this.cushion5, 0xffff00));
		// this.add(new THREE.BoxHelper(this.cushion6, 0xffff00));
	}

	checkCollisionWithCushion(ball: Ball): void {
		const ballBB = ball.geometry.boundingBox.clone();
		ballBB.applyMatrix4(ball.matrixWorld);

		let cushion1BB = this.cushion1.geometry.boundingBox.clone();
		let cushion2BB = this.cushion2.geometry.boundingBox.clone();
		let cushion3BB = this.cushion3.geometry.boundingBox.clone();
		let cushion4BB = this.cushion4.geometry.boundingBox.clone();
		let cushion5BB = this.cushion5.geometry.boundingBox.clone();
		let cushion6BB = this.cushion6.geometry.boundingBox.clone();

		cushion1BB.applyMatrix4(this.cushion1.matrixWorld);
		cushion2BB.applyMatrix4(this.cushion2.matrixWorld);
		cushion3BB.applyMatrix4(this.cushion3.matrixWorld);
		cushion4BB.applyMatrix4(this.cushion4.matrixWorld);
		cushion5BB.applyMatrix4(this.cushion5.matrixWorld);
		cushion6BB.applyMatrix4(this.cushion6.matrixWorld);

		const ballVel = ball.getVelocity().clone();
		// if (isNaN(ballVel.x)) {
		// 	debugger;
		// }
		const ballMass = ball.getMass();
		const impulse = ballVel
			.multiplyScalar(-1 * (1 + SceneManager.ELASTICITY_BALL_CUSHION))
			.multiplyScalar(ballMass);

		if (cushion1BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion1, ball, impulse);
		}

		if (cushion2BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion2, ball, impulse);
		}

		if (cushion3BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion3, ball, impulse);
		}

		if (cushion4BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion4, ball, impulse);
		}

		if (cushion5BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion5, ball, impulse);
		}

		if (cushion6BB.intersectsBox(ballBB)) {
			this.handleCollision(this.cushion6, ball, impulse);
		}
	}

	handleCollision(cushion: TableCushion, ball: Ball, impulse: THREE.Vector3) {
		SceneManager.collisionTracker[ball.getBallName()].add(cushion);
		const magImpulseOnNormal = Math.abs(
			impulse.dot(this.cushion1.getSurfaceNormal())
		);
		const impulseOnBall = cushion
			.getSurfaceNormal()
			.clone()
			.setLength(magImpulseOnNormal);
		ball.goBack();
		// console.log(
		// 	cushion.name + " Applying impulse " +
		// 		impulseOnBall.x +
		// 		" " +
		// 		impulseOnBall.y +
		// 		" " +
		// 		impulseOnBall.z
		// );
		ball.applyImpulse(impulseOnBall);
	}
}
