class Ball extends THREE.Mesh {
	private radius: number;
	private velocity: number;
	private angvelocity: number;
	private force: number;
	private rotation_deg: number;
	private frictional_coeff: number;
	private momentum: number;
	private angularmoment: number;
	private mass: number;
	private acceleration: number;
	private angacceleration: number;
	// static BALL_DIM_FT = 1;
	static BALL_DIM_FT = 0.0859375;

	constructor(radius: number) {
		const geometry_ball = new THREE.SphereGeometry(Ball.BALL_DIM_FT, 32, 32);
		const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		super(geometry_ball, material_ball);
		this.radius = radius;
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
