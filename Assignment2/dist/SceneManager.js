class SceneManager {
    constructor(scene) {
        this.balls = [];
        this.scene = scene;
        this.table = this.createTable();
        const ball = new Ball(BALL_DIM_FT);
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
                    return true;
                }
            }
        }
        return false;
    }
    detectBallCushionCollision() {
        for (let ball of this.balls) {
            ball.geometry.computeBoundingBox();
            const ballBB = ball.geometry.boundingBox;
            if (this.table.checkCollisionWithCushion(ballBB)) {
                return true;
            }
        }
        return false;
    }
    detectCollision() {
        return this.detectBallsCollision() || this.detectBallCushionCollision();
    }
    determineCollision() {
        return [];
    }
    handleCollision(collidingObjects) { }
    myUpdate() {
        for (let ball of this.balls) {
            ball.myUpdate();
        }
        if (this.detectCollision()) {
            console.log("Collision Detected");
            const collidingOBjects = this.determineCollision();
            this.handleCollision(collidingOBjects);
        }
    }
}
//# sourceMappingURL=SceneManager.js.map