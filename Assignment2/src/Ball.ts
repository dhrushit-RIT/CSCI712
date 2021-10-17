class Ball extends THREE.Mesh {

    private radius:number;
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

	constructor(radius: number,geometry_ball: THREE.SphereGeometry,material_ball: THREE.MeshBasicMaterial) {
		super(geometry_ball,material_ball);
        this.radius=radius;
	}

}