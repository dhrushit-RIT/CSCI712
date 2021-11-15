class SceneManager {
	private scene: THREE.Scene;
	private particle_systems: ParticleSystem[];
	private previousTime: number = 0;

	constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.particle_systems = [];
		for (let particleSystem of this.particle_systems) {
			scene.add(particleSystem);
		}
	}

	myUpdate(currTime: number) {
		for (let particleSystem of this.particle_systems) {
			particleSystem.myUpdate(currTime - this.previousTime);
		}
		this.previousTime = currTime;
	}
}
