class ParticleSystem extends THREE.Group {
	private particles: Particle[] = [];
	private reusePool: Particle[] = [];
	private velocity: THREE.Vector3;
	private acceleration: THREE.Vector3;

	private particleFeatures: IParticleFeatures;
	constructor(numParticles: number, particleFeatures: IParticleFeatures) {
		super();
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.particleFeatures = particleFeatures;
		for (let i = 0; i < numParticles; i++) {
			let particle = new Particle(
				this.reusePool,
				this.position,
				particleFeatures.size,
				particleFeatures.color,
				particleFeatures.velocity.add(this.velocity),
				particleFeatures.acceleration,
				particleFeatures.alfa,
				particleFeatures.deltaAlfa
			);

			this.addParticle(particle);
			this.add(particle);
		}
	}

	addParticle(particle: Particle) {
		this.particles.push(particle);
	}

	myUpdate(deltaTime: number) {
		for (let particle of this.particles) {
			particle.myUpdate(deltaTime);
		}

		this.reallocateUnusedParticles();
	}

	reallocateUnusedParticles() {
		while (this.reusePool.length > 0) {
			let particle: Particle = this.reusePool.pop();
			particle.init(
				this.position,
				this.particleFeatures.size,
				this.particleFeatures.color,
				this.particleFeatures.velocity,
				this.particleFeatures.acceleration,
				this.particleFeatures.alfa,
				this.particleFeatures.deltaAlfa,
				this.particleFeatures.mass,
				this.particleFeatures.lifeTime
			);
		}
	}
}
