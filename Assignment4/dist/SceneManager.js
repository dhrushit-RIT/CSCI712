class SceneManager {
    constructor(scene) {
        this.previousTime = 0;
        this.scene = scene;
        this.particle_systems = [];
        const particle_system = new ParticleSystem(100, 300, 1, {
            color: new THREE.Color(0.0, 0.0, 255.0),
            size: 0.1,
            velocity: {
                min: new THREE.Vector3(0, 0, 0),
                max: new THREE.Vector3(0, 1, 0),
            },
            acceleration: {
                min: new THREE.Vector3(0, 0, 0),
                max: new THREE.Vector3(0, 1, 0),
            },
        }, 10);
        this.particle_systems.push(particle_system);
        for (let particleSystem of this.particle_systems) {
            scene.add(particleSystem);
        }
    }
    myUpdate(currTime) {
        for (let particleSystem of this.particle_systems) {
            particleSystem.myUpdate(currTime - this.previousTime);
        }
        this.previousTime = currTime;
    }
}
//# sourceMappingURL=SceneManager.js.map