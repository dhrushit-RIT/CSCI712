class SceneManager {
    constructor(scene) {
        this.balls = [];
        this.simulate = true;
        this.u = 0;
        this.scene = scene;
        this.createTable(scene, new THREE.Vector3(0, -0.1, 0));
        this.addBall("ball0", scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(6, 0, 0));
        this.addBall("ball1", scene, new THREE.Vector3(Table.TABLE_WIDTH / 4, 0, 0), new THREE.Vector3(0, 0, 0));
        this.addBall("ball2", scene, new THREE.Vector3(Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414, 0, Ball.BALL_RADIUS * 1.414), new THREE.Vector3(0, 0, 0));
        this.addBall("ball3", scene, new THREE.Vector3(Table.TABLE_WIDTH / 4 + Ball.BALL_RADIUS * 1.414, 0, -Ball.BALL_RADIUS * 1.414), new THREE.Vector3(0, 0, 0));
        for (let ball of this.balls) {
            SceneManager.collisionTracker[ball.getBallName()] = new Set();
        }
    }
    addBall(name, scene, initPos, initVel) {
        const ball = new Ball(name);
        ball.position.set(initPos.x, initPos.y, initPos.z);
        ball.setVelocity(initVel);
        scene.add(ball);
        this.balls.push(ball);
    }
    createTable(scene, initPos) {
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
            new THREE.MeshBasicMaterial({ color: 0xff00ff }),
            new THREE.MeshBasicMaterial({ color: 0xffff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }),
        ];
        this.table = new Table(materials);
        this.table.position.set(initPos.x, initPos.y, initPos.z);
        scene.add(this.table);
    }
    detectBallsCollision() {
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball1 = this.balls[i];
                const ball2 = this.balls[j];
                const ball1BB = this.balls[i].geometry.boundingSphere.clone();
                const ball2BB = this.balls[j].geometry.boundingSphere.clone();
                let ball1BBWorld = ball1BB.applyMatrix4(ball1.matrixWorld);
                let ball2BBWorld = ball2BB.applyMatrix4(ball2.matrixWorld);
                const dist = ball1.position.clone().sub(ball2.position).length();
                if (dist < 2 * Ball.BALL_RADIUS) {
                    const ball1Vel = ball1.getVelocity().clone();
                    const ball2Vel = ball2.getVelocity().clone();
                    const ball1Mass = ball1.getMass();
                    const ball2Mass = ball2.getMass();
                    const impulse = ball1Vel
                        .sub(ball2Vel)
                        .multiplyScalar(1 + SceneManager.ELASTICITY_BALL_BALL)
                        .multiplyScalar((ball1Mass * ball2Mass) / (ball1Mass + ball2Mass));
                    const vecB1ToB2 = ball2
                        .getPosition()
                        .clone()
                        .sub(ball1.getPosition())
                        .normalize();
                    const vecB2ToB1 = ball1
                        .getPosition()
                        .clone()
                        .sub(ball2.getPosition())
                        .normalize();
                    const magImpulseOnNormal = Math.abs(impulse.dot(vecB2ToB1));
                    console.log(ball1.getBallName() +
                        " collided " +
                        ball2.getBallName() +
                        " impulse along normal " +
                        magImpulseOnNormal);
                    const impulseOnB1 = vecB2ToB1
                        .normalize()
                        .setLength(magImpulseOnNormal);
                    const impulseOnB2 = vecB1ToB2
                        .normalize()
                        .setLength(magImpulseOnNormal);
                    const distB1B2 = ball1.position.clone().sub(ball2.position).length();
                    const moveDist = 2 * Ball.BALL_RADIUS - distB1B2;
                    const B1ToB2 = ball2.position.clone().sub(ball1.position).normalize();
                    const B2ToB1 = ball1.position.clone().sub(ball2.position).normalize();
                    const ball1Pos = ball1.position
                        .clone()
                        .add(B2ToB1.setLength(moveDist / 2));
                    const ball2Pos = ball2.position
                        .clone()
                        .add(B1ToB2.setLength(moveDist / 2));
                    ball1.setPosition(ball1Pos);
                    ball2.setPosition(ball2Pos);
                    ball1.applyImpulse(impulseOnB1);
                    ball2.applyImpulse(impulseOnB2);
                }
            }
        }
    }
    detectBallCushionCollision() {
        for (let ball of this.balls) {
            this.table.checkCollisionWithCushion(ball);
        }
    }
    detectCollision() {
        this.detectBallCushionCollision();
        this.detectBallsCollision();
    }
    handleCollision(collidingObjects) { }
    applyFriction() {
        for (let ball of this.balls) {
            ball.applyFriction();
        }
    }
    printTracker() {
        for (let key in SceneManager.collisionTracker) {
            console.log(SceneManager.collisionTracker[key]);
        }
        SceneManager.collisionTracker = {};
        for (let ball of this.balls) {
            SceneManager.collisionTracker[ball.getBallName()] = new Set();
        }
    }
    myUpdate(elapsedTime) {
        this.applyFriction();
        if (this.simulate) {
            elapsedTime = this.u;
            this.u += SceneManager.MIN_DELTA_T / 2;
        }
        for (let ball of this.balls) {
            ball.myUpdate(elapsedTime);
        }
        this.detectCollision();
        console.log("collision tracker");
    }
}
SceneManager.BALL_DIM_FT = 0.0859375;
SceneManager.ELASTICITY_BALL_BALL = 1;
SceneManager.ELASTICITY_BALL_CUSHION = 0.9;
SceneManager.COEFF_FRIC_BALL_SURFACE = 0.1;
SceneManager.GRAVITY = 9.8;
SceneManager.MIN_DELTA_T = 0.016;
SceneManager.collisionTracker = {};
//# sourceMappingURL=SceneManager.js.map