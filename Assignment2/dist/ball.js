class Ball extends THREE.Mesh {
    constructor(radius) {
        const geometry_ball = new THREE.SphereGeometry(BALL_DIM_FT, 32, 32);
        const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        super(geometry_ball, material_ball);
        this.radius = radius;
    }
    myUpdate() { }
}
Ball.BALL_DIM_FT = 0.0859375;
//# sourceMappingURL=Ball.js.map