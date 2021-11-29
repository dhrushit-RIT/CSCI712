class Particle extends THREE.Mesh {
    constructor(reusePool, pos, size, color, velocity, acceleration, opacity, deltaAlfa, mass, lifetime) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
            vertexColors: false,
        });
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
        ];
        super(geometry, materials);
        this.reusePool = reusePool || null;
        this.init(pos, size, color, velocity, acceleration, opacity, deltaAlfa, mass, lifetime);
    }
    init(pos, size, color, velocity, acceleration, alfa, deltaAlfa, mass, lifeTime) {
        this.elapsedTime = 0;
        this.position.set(pos.x, pos.y, pos.z);
        this.size = size || 1.0;
        this.color = color || new THREE.Color(1, 1, 1);
        this.velocity = velocity || new THREE.Vector3(0, 0, 0);
        this.acceleration = acceleration || new THREE.Vector3(0, 0, 0);
        this.alfa = alfa || 1.0;
        this.deltaAlfa = deltaAlfa || 0.0;
        for (let material of this.material) {
            material.transparent = true;
            material.opacity = 1.0;
        }
        this.mass = mass || 1.0;
        this.lifeTime = lifeTime || -1.0;
    }
    myUpdate(deltaTime) {
        this.updatePosition(deltaTime);
        this.updateVelocity(deltaTime);
        this.updateAlfa();
        this.updateLifetime();
        this.elapsedTime += deltaTime;
    }
    updateVelocity(deltaTime) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(0.5 * deltaTime));
    }
    updateLifetime() {
        if (this.lifeTime > 0 && this.elapsedTime > this.lifeTime) {
            this.afterLife();
        }
    }
    afterLife() {
        this.reusePool.push(this);
    }
    updatePosition(deltaTime) {
        let pos = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        pos = pos
            .add(this.velocity.clone().multiplyScalar(deltaTime))
            .add(this.acceleration.clone().multiplyScalar(0.5 * deltaTime * deltaTime));
        this.position.set(pos.x, pos.y, pos.z);
    }
    updateAlfa() {
        this.alfa += this.deltaAlfa;
        this.alfa = Math.max(this.alfa, 0);
        for (let material of this.material) {
            material.opacity = this.alfa;
        }
    }
}
//# sourceMappingURL=Particle.js.map