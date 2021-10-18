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
			cushionGeometry,
			material,
			Table.TABLE_WIDTH
		);
		this.cushion2 = new TableCushion(
			cushionGeometry,
			material,
			Table.TABLE_LENGTH
		);
		this.cushion3 = new TableCushion(
			cushionGeometry,
			material,
			Table.TABLE_WIDTH
		);
		this.cushion4 = new TableCushion(
			cushionGeometry,
			material,
			Table.TABLE_LENGTH
		);
		this.cushion5 = new TableCushion(
			cushionGeometry,
			material,
			Table.TABLE_LENGTH
		);
		this.cushion6 = new TableCushion(
			cushionGeometry,
			material,
			Table.TABLE_LENGTH
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

		this.cushion5.position.setX(Table.TABLE_WIDTH / 2);
		this.cushion5.position.setZ(-Table.TABLE_WIDTH / 2);
		this.cushion6.position.setX(-Table.TABLE_WIDTH / 2);
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

		this.add(new THREE.BoxHelper(this.cushion1, 0xffff00));
		this.add(new THREE.BoxHelper(this.cushion2, 0xffff00));
		this.add(new THREE.BoxHelper(this.cushion3, 0xffff00));
		this.add(new THREE.BoxHelper(this.cushion4, 0xffff00));
		this.add(new THREE.BoxHelper(this.cushion5, 0xffff00));
		this.add(new THREE.BoxHelper(this.cushion6, 0xffff00));
	}

	checkCollisionWithCushion(objectBoundingBox: THREE.Box3): Boolean {
		let colliding = false;

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

		colliding = colliding || cushion1BB.intersectsBox(objectBoundingBox);
		colliding = colliding || cushion2BB.intersectsBox(objectBoundingBox);
		colliding = colliding || cushion3BB.intersectsBox(objectBoundingBox);
		colliding = colliding || cushion4BB.intersectsBox(objectBoundingBox);
		colliding = colliding || cushion5BB.intersectsBox(objectBoundingBox);
		colliding = colliding || cushion6BB.intersectsBox(objectBoundingBox);

		return colliding;
	}
}
