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
		ball.position.x = 0;
		ball.position.y = 0;
		ball.position.z = 0;
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

	myUpdate() {
		for (let ball of this.balls) {
			ball.myUpdate();
		}
	}
}
