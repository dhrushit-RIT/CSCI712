class Ball extends THREE.Mesh {
	private radius: number;
	private velocity: THREE.Vector3;
	private angvelocity: number;
	private force: THREE.Vector3;
	private rotation_deg: number;
	private frictional_coeff: number;
	private momentum: number;
	private angularmoment: number;
	private mass: number;
	private acceleration: THREE.Vector3;
	private angacceleration: number;
	// static BALL_DIM_FT = 1;
	static BALL_DIM_FT = 0.0859375;

	constructor() {
		const geometry_ball = new THREE.SphereGeometry(Ball.BALL_DIM_FT, 32, 32);
		const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		super(geometry_ball, material_ball);
	}

	myUpdate() {
		this.updateMatrix();
		this.updateMatrixWorld(true);
	}

	exertForce() {}
}

interface IBall {
	exertForce(): void;
}
