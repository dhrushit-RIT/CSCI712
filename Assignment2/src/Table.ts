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
			Table.TABLE_WIDTH,
		);
		const cushionGeometry = new THREE.BoxGeometry(Table.TABLE_WIDTH, 0.5, 0.1);
		this.surface = new THREE.Mesh(surfaceGeometry, material);
		this.cushion1 = new TableCushion(cushionGeometry, material, Table.TABLE_WIDTH);
		this.cushion2 = new TableCushion(cushionGeometry, material, Table.TABLE_LENGTH);
		this.cushion3 = new TableCushion(cushionGeometry, material, Table.TABLE_WIDTH);
		this.cushion4 = new TableCushion(cushionGeometry, material, Table.TABLE_LENGTH);
		this.cushion5 = new TableCushion(cushionGeometry, material, Table.TABLE_LENGTH);
		this.cushion6 = new TableCushion(cushionGeometry, material, Table.TABLE_LENGTH);

		// this.cushion1.position.set(2, 2, 2);
		this.cushion1.rotateY(Math.PI/2);
		this.cushion4.rotateY(Math.PI/2);
		this.cushion1.position.setX(Table.TABLE_WIDTH);
		this.cushion4.position.setX(-Table.TABLE_WIDTH);
		
		this.cushion2.position.setX(Table.TABLE_WIDTH/2);
		this.cushion2.position.setZ(Table.TABLE_WIDTH/2);
		this.cushion3.position.setX(-Table.TABLE_WIDTH/2);
		this.cushion3.position.setZ(Table.TABLE_WIDTH/2);

		this.cushion5.position.setX(Table.TABLE_WIDTH/2);
		this.cushion5.position.setZ(-Table.TABLE_WIDTH/2);
		this.cushion6.position.setX(-Table.TABLE_WIDTH/2);
		this.cushion6.position.setZ(-Table.TABLE_WIDTH/2);


		this.add(this.surface);
		this.add(this.cushion1);
		this.add(this.cushion2);
		this.add(this.cushion3);
		this.add(this.cushion4);
		this.add(this.cushion5);
		this.add(this.cushion6);
	}

}
