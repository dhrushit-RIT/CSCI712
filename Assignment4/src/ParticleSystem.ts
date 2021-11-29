class ParticleSystem extends THREE.Group {
	private particles: Particle[] = [];
	private reusePool: Particle[] = [];
	private emmiters: Emmiter[] = [];
	private velocity: THREE.Vector3;
	private acceleration: THREE.Vector3;
	private genSide: number;
	private emmissionElapsedTime: number;
	private emmissionRate: number;
	private numParticlesAtATime: number;
	private maxParticles: number;

	private particleFeatures: IParticleFeatures;
	constructor(
		numParticles: number,
		maxParticles: number,
		emmissionRate: number,
		particleFeatures: IParticleFeatures,
		genSide: number
	) {
		super();
		this.emmissionElapsedTime = 0;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.particleFeatures = particleFeatures;
		this.genSide = genSide;
		this.emmissionRate = emmissionRate;
		this.numParticlesAtATime = numParticles;
		this.maxParticles = maxParticles;
		// const emmiter = new Emmiter(particleFeatures);
		// this.emmiters.push(emmiter);
		this.createNNewParticles(this.numParticlesAtATime);
	}

	createNNewParticles(numParticles: number) {
		for (let i = 0; i < numParticles; i++) {
			const particle = this.createParticle();
			this.add(particle);
			this.particles.push(particle);
		}
	}

	createParticle(): Particle {
		const randPos = this.getRandomPosition();
		return new Particle(
			this.reusePool,
			randPos,
			this.particleFeatures.size,
			this.particleFeatures.color,
			this.getVec3InRange(this.particleFeatures.velocity, this.velocity),
			this.getAcceleration(
				this.particleFeatures.acceleration,
				this.acceleration,
				randPos
			) /* .add(new THREE.Vector3(this.genSide * 10, 0, this.genSide * 10)) */,
			this.particleFeatures.alfa,
			this.particleFeatures.deltaAlfa,
			this.particleFeatures.mass,
			this.particleFeatures.lifeTime
		);
	}

	getAcceleration(
		particleProperty: { min: THREE.Vector3; max: THREE.Vector3 },
		pSProperty: THREE.Vector3,
		currPos: THREE.Vector3
	) {
		const base = this.getVec3InRange(particleProperty, pSProperty);
		return new THREE.Vector3(
			base.x + currPos.x * 5,
			base.y + 2,
			base.z + currPos.z * 5
		);
	}

	sign(val: number) {
		if (val >= 0) {
			return 1;
		} else {
			return -1;
		}
	}

	getVec3InRange(
		particleProperty: { min: THREE.Vector3; max: THREE.Vector3 },
		pSProperty: THREE.Vector3
	): THREE.Vector3 {
		const vX =
			Math.random() * (particleProperty.max.x - particleProperty.min.x) +
			particleProperty.min.x;

		const vY =
			Math.random() * (particleProperty.max.y - particleProperty.min.y) +
			particleProperty.min.y;

		const vZ =
			Math.random() * (particleProperty.max.z - particleProperty.min.z) +
			particleProperty.min.z;

		return pSProperty.clone().add(new THREE.Vector3(vX, vY, vZ));
	}

	getRandomPosition() {
		const initialX = Math.random() * this.genSide * 2 - this.genSide;
		const initialY = Math.random() * this.genSide * 2 - this.genSide;
		const initialZ = Math.random() * this.genSide * 2 - this.genSide;

		return this.position
			.clone()
			.add(new THREE.Vector3(initialX, initialY, initialZ));
	}

	addParticle(particle: Particle) {
		this.particles.push(particle);
	}

	myUpdate(deltaTime: number) {
		for (let particle of this.particles) {
			particle.myUpdate(deltaTime);
		}

		this.emmissionElapsedTime += deltaTime;

		this.reallocateUnusedParticles();
		this.rotateOnAxis(new THREE.Vector3(1, 0, 0), this.toRadian(1));
	}

	toRadian(deg: number) {
		return (deg * Math.PI) / 180;
	}

	reallocateUnusedParticles() {
		let numParticlesCreated = 0;
		console.log(" pool particles: " + this.reusePool.length);
		while (
			this.reusePool.length > 0 &&
			numParticlesCreated < this.numParticlesAtATime
		) {
			const randPos = this.getRandomPosition();
			let particle: Particle = this.reusePool.pop();
			numParticlesCreated += 1;
			particle.init(
				randPos,
				this.particleFeatures.size,
				this.particleFeatures.color,
				this.getVec3InRange(this.particleFeatures.velocity, this.velocity),
				this.getAcceleration(
					this.particleFeatures.acceleration,
					this.acceleration,
					randPos
				),
				this.particleFeatures.alfa,
				this.particleFeatures.deltaAlfa,
				this.particleFeatures.mass,
				this.particleFeatures.lifeTime
			);
		}

		if (this.emmissionElapsedTime > this.emmissionRate) {
			console.log(
				"creating " +
					(this.numParticlesAtATime - numParticlesCreated) +
					" new particles " +
					" total particles : " +
					this.particles.length +
					" pool particles: " +
					this.reusePool.length
			);
			this.emmissionElapsedTime = 0;
			if (
				numParticlesCreated < this.numParticlesAtATime &&
				this.particles.length < this.maxParticles
			) {
				this.createNNewParticles(
					this.numParticlesAtATime - numParticlesCreated
				);
			}
		}
	}
}
