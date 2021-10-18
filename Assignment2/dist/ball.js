class Ball extends THREE.Mesh {
    constructor(radius) {
        const geometry_ball = new THREE.SphereGeometry(Ball.BALL_DIM_FT, 32, 32);
        const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        super(geometry_ball, material_ball);
        this.radius = radius;
    }
    myUpdate() { }
    exertForce() { }
}
Ball.BALL_DIM_FT = 1;
//# sourceMappingURL=Ball.js.map