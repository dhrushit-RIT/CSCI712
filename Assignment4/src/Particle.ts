class Particle extends THREE.Mesh {
	private velocity: THREE.Vector3;
	private acceleration: THREE.Vector3;
	private size: number;
	private color: THREE.Color;
	private alfa: number;
	private deltaAlfa: number;
	private mass: number;
	private lifeTime: number;
	private elapsedTime: number;
	reusePool: Particle[];

	constructor(
		reusePool: Particle[],
		pos: THREE.Vector3,
		size: number,
		color: THREE.Color,
		velocity?: THREE.Vector3,
		acceleration?: THREE.Vector3,
		opacity?: number,
		deltaAlfa?: number,
		mass?: number,
		lifetime?: number
	) {
		super();
		this.reusePool = reusePool || null;
		this.init(
			pos,
			size,
			color,
			velocity,
			acceleration,
			opacity,
			deltaAlfa,
			mass,
			lifetime
		);
	}

	init(
		pos: THREE.Vector3,
		size: number,
		color: THREE.Color,
		velocity?: THREE.Vector3,
		acceleration?: THREE.Vector3,
		alfa?: number,
		deltaAlfa?: number,
		mass?: number,
		lifeTime?: number
	) {
		this.position.set(pos.x, pos.y, pos.z);
		this.size = size || 1.0;
		this.color = color || new THREE.Color(1, 1, 1);
		this.velocity = velocity || new THREE.Vector3(0, 0, 0);
		this.acceleration = acceleration || new THREE.Vector3(0, 0, 0);
		this.alfa = alfa || 1.0;
		this.deltaAlfa = deltaAlfa || 0.0;
		(this.material as THREE.Material).transparent = true;
		(this.material as THREE.Material).opacity = 1.0;
		this.mass = mass || 1.0;
		this.lifeTime = lifeTime || -1.0;
	}

	public myUpdate(deltaTime: number) {
		this.updatePosition(deltaTime);
		this.updateAlfa();
		this.updateLifetime();
	}

	private updateLifetime() {
		if (this.lifeTime > 0 && this.elapsedTime > this.lifeTime) {
			this.afterLife();
		}
	}

	private afterLife() {
		this.reusePool.push(this);
	}

	private updatePosition(deltaTime: number) {
		let pos: THREE.Vector3 = new THREE.Vector3(
			this.position.x,
			this.position.y,
			this.position.z
		);

		pos = pos
			.add(this.velocity.multiplyScalar(deltaTime))
			.add(this.acceleration.multiplyScalar(0.5 * deltaTime * deltaTime));

		this.position.set(pos.x, pos.y, pos.z);
	}

	private updateAlfa() {
		this.alfa += this.deltaAlfa;
	}
}

interface IParticleFeatures {
	size: number;
	color: THREE.Color;
	velocity?: THREE.Vector3;
	acceleration?: THREE.Vector3;
	alfa?: number;
	deltaAlfa?: number;
	mass?: number;
	lifeTime?: number;
}
