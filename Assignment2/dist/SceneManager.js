class SceneManager {
    constructor(scene) {
        this.balls = [];
        this.scene = scene;
        this.table = this.createTable();
        const ball = new Ball();
        this.balls.push(ball);
        scene.add(this.table);
        for (let ball of this.balls) {
            scene.add(ball);
        }
        this.table.position.x = 0;
        this.table.position.y = -0.1;
        this.table.position.z = 0;
        ball.position.x = 0;
        ball.position.y = 0;
        ball.position.z = 0;
        scene.add(new THREE.BoxHelper(ball));
    }
    createTable() {
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
            new THREE.MeshBasicMaterial({ color: 0xff00ff }),
            new THREE.MeshBasicMaterial({ color: 0xffff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }),
        ];
        return new Table(materials);
    }
    detectBallsCollision() {
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball1 = this.balls[i];
                const ball2 = this.balls[j];
                const ball1BB = this.balls[i].geometry.boundingBox;
                const ball2BB = this.balls[j].geometry.boundingBox;
                if (ball1BB.intersectsBox(ball2BB)) {
                    const ball1Vel = ball1.getVelocity().clone();
                    const ball2Vel = ball2.getVelocity().clone();
                    const ball1Mass = ball1.getMass();
                    const ball2Mass = ball2.getMass();
                    const impulse = ball1Vel
                        .sub(ball2Vel)
                        .multiplyScalar(-1 * (1 + SceneManager.ELASTICITY_BALL_BALL))
                        .multiplyScalar((ball1Mass * ball2Mass) / (ball1Mass + ball2Mass));
                    const vecB1ToB2 = ball2
                        .getPosition()
                        .clone()
                        .sub(ball1.getPosition());
                    const vecB2ToB1 = ball1
                        .getPosition()
                        .clone()
                        .sub(ball2.getPosition());
                    const magImpulseOnNormal = impulse.dot(vecB2ToB1);
                    const impulseOnB1 = vecB2ToB1
                        .normalize()
                        .multiplyScalar(magImpulseOnNormal);
                    const impulseOnB2 = vecB1ToB2
                        .normalize()
                        .multiplyScalar(magImpulseOnNormal);
                    ball1.applyImpulse(impulseOnB1);
                    ball2.applyImpulse(impulseOnB2);
                    return true;
                }
            }
        }
        return false;
    }
    detectBallCushionCollision() {
        for (let ball of this.balls) {
            this.table.checkCollisionWithCushion(ball);
        }
        return false;
    }
    detectCollision() {
        return this.detectBallsCollision() || this.detectBallCushionCollision();
    }
    handleCollision(collidingObjects) { }
    myUpdate(elapsedTime) {
        for (let ball of this.balls) {
            ball.myUpdate(elapsedTime);
        }
        this.detectCollision();
    }
}
SceneManager.BALL_DIM_FT = 0.0859375;
SceneManager.ELASTICITY_BALL_BALL = 1;
SceneManager.ELASTICITY_BALL_CUSHION = 1;
//# sourceMappingURL=SceneManager.js.map