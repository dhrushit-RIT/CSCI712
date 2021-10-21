class Ball extends THREE.Mesh {
    constructor() {
        const geometry_ball = new THREE.SphereGeometry(Ball.BALL_RADIUS, 32, 32);
        const material_ball = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        super(geometry_ball, material_ball);
        this.lastTime = 0;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.impulsiveAcceleration = new THREE.Vector3(0, 0, 0);
        this.forceOnBall = new THREE.Vector3(0, 0, 0);
        this.mass = 1;
        this.geometry.computeBoundingBox();
    }
    setPosition(pos) {
        this.position.set(pos.x, pos.y, pos.z);
    }
    setVelocity(vel) {
        this.velocity.set(vel.x, vel.y, vel.z);
    }
    setAcceleration(acc) {
        this.acceleration.set(acc.x, acc.y, acc.z);
    }
    getPosition() {
        return this.position;
    }
    getVelocity() {
        return this.velocity;
    }
    getAcceleration() {
        return this.acceleration;
    }
    getMass() {
        return this.mass;
    }
    myUpdate(time) {
        this.updateMatrix();
        this.updateMatrixWorld(true);
        const deltaT = time - this.lastTime;
        this.updatePosition(deltaT);
        this.updateVelocity(deltaT);
        this.lastTime = time;
        this.lastDeltaT = deltaT;
    }
    updatePosition(deltaT) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaT));
        this.position.add(this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT));
    }
    updateVelocity(deltaT) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaT));
    }
    updateAcceleration() {
        this.acceleration.add(this.forceOnBall.clone().multiplyScalar(1 / this.mass));
    }
    applyForce(force) {
        this.forceOnBall = force;
        this.updateAcceleration();
        this.forceOnBall.set(0, 0, 0);
    }
    applyImpulse(impulse) {
        this.velocity.add(impulse.multiplyScalar(1 / this.mass));
        console.log("velocity after impulse " +
            this.velocity.x +
            " " +
            this.velocity.y +
            " " +
            this.velocity.z);
    }
    goBack() {
        this.position.add(this.velocity.clone().multiplyScalar(-2 * this.lastDeltaT));
        this.position.add(this.acceleration
            .clone()
            .multiplyScalar(0.5 * this.lastDeltaT * this.lastDeltaT));
    }
}
Ball.BALL_RADIUS = 0.0859375;
//# sourceMappingURL=Ball.js.map