class Ball extends THREE.Mesh {
    constructor(ballname) {
        const geometry_ball = new THREE.SphereGeometry(Ball.BALL_RADIUS, 32, 32);
        const material_ball = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff,
        });
        super(geometry_ball, material_ball);
        this.lastTime = 0;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.previousVelocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.previousAcceleration = new THREE.Vector3(0, 0, 0);
        this.impulsiveAcceleration = new THREE.Vector3(0, 0, 0);
        this.forceOnBall = new THREE.Vector3(0, 0, 0);
        this.mass = 1;
        this.weight = this.mass * SceneManager.GRAVITY;
        this.lastDeltaT = SceneManager.MIN_DELTA_T;
        this.collisionHandled = true;
        this.geometry.computeBoundingBox();
        this.geometry.computeBoundingSphere();
        this.ballname = ballname;
        this.ignoreImpulse = false;
        this.ignoreCount = 0;
    }
    getBallName() {
        return this.ballname;
    }
    setPosition(pos) {
        this.position.set(pos.x, pos.y, pos.z);
    }
    setVelocity(vel) {
        this.previousVelocity.set(this.velocity.x, this.velocity.y, this.velocity.z);
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
    getWeight() {
        return this.weight;
    }
    myUpdate(time) {
        this.updateMatrix();
        this.updateMatrixWorld(true);
        const deltaT = time - this.lastTime;
        this.updatePosition(deltaT);
        this.updateVelocity(deltaT);
        this.updateAcceleration();
        this.lastTime = time;
        this.lastDeltaT = deltaT;
        console.log(this.ballname +
            " " +
            this.velocity.x +
            " " +
            this.velocity.y +
            " " +
            this.velocity.z);
    }
    updatePosition(deltaT) {
        this.previousPosition = this.position.clone();
        this.position.add(this.velocity.clone().multiplyScalar(deltaT));
        this.position.add(this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT));
        if (!this.collisionHandled) {
            this.position.add(this.velocity.clone().multiplyScalar(deltaT));
            this.position.add(this.acceleration.clone().multiplyScalar(0.5 * deltaT * deltaT));
            this.collisionHandled = true;
        }
    }
    updateVelocity(deltaT) {
        this.previousVelocity.set(this.velocity.x, this.velocity.y, this.velocity.z);
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaT));
    }
    updateAcceleration() {
        this.previousAcceleration.set(this.acceleration.x, this.acceleration.y, this.acceleration.z);
        this.acceleration.add(this.forceOnBall.clone().multiplyScalar(1 / this.mass));
    }
    applyForce(force) {
        this.forceOnBall = force;
        this.updateAcceleration();
        this.forceOnBall.set(0, 0, 0);
    }
    applyImpulsiveForce(force) {
        const impulse = force.multiplyScalar(this.lastDeltaT);
        this.applyImpulse(impulse);
    }
    applyImpulse(impulse) {
        if (this.ignoreImpulse) {
            this.ignoreCount += 1;
            if (this.ignoreCount > Ball.IGNORE_COUNT_MAX) {
                this.ignoreImpulse = false;
                this.ignoreCount = 0;
            }
        }
        if (!this.ignoreImpulse) {
            this.collisionHandled = false;
            this.velocity.add(impulse.multiplyScalar(1 / this.mass));
        }
    }
    goBack(deltaT) {
        const dt = deltaT || this.lastDeltaT;
        this.position.add(this.velocity.clone().multiplyScalar(-2 * dt));
        this.position.add(this.acceleration.clone().multiplyScalar(0.5 * dt * dt));
    }
    applyFriction() {
        const frictionForceMag = SceneManager.COEFF_FRIC_BALL_SURFACE * this.weight;
        const frictionalAccelerationMag = frictionForceMag / this.mass;
        const frictionalAccelerationDir = this.velocity
            .clone()
            .normalize()
            .multiplyScalar(-1);
        const frictionalAcceleration = frictionalAccelerationDir.setLength(frictionalAccelerationMag);
        const deltaTForZeroVelocity = this.velocity.length() / frictionalAccelerationMag;
        if (deltaTForZeroVelocity > SceneManager.MIN_DELTA_T) {
            this.velocity.add(frictionalAcceleration.multiplyScalar(this.lastDeltaT));
        }
        else {
            this.velocity.set(0, 0, 0);
        }
    }
}
Ball.BALL_RADIUS = 0.0859375;
Ball.IGNORE_COUNT_MAX = 3;
//# sourceMappingURL=Ball.js.map