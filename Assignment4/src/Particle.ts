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
		const geometry = new THREE.BoxGeometry(size, size, size);
		const material = new THREE.MeshBasicMaterial({
			vertexColors: false,
		});

		const materials: THREE.MeshBasicMaterial[] = [
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xff0000 */ }),
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x00ff00 */ }),
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x0000ff */ }),
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xff00ff */ }),
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0xffff00 */ }),
			new THREE.MeshBasicMaterial({ color: 0xffffff /* 0x00ffff */ }),
		];
		super(geometry, materials);
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
		this.elapsedTime = 0;
		this.position.set(pos.x, pos.y, pos.z);
		this.size = size || 1.0;
		this.color = color || new THREE.Color(1, 1, 1);
		this.velocity = velocity || new THREE.Vector3(0, 0, 0);
		this.acceleration = acceleration || new THREE.Vector3(0, 0, 0);
		this.alfa = alfa || 1.0;
		this.deltaAlfa = deltaAlfa || 0.0;
		for (let material of this.material as THREE.Material[]) {
			material.transparent = true;
			material.opacity = 1.0;
		}
		this.mass = mass || 1.0;
		this.lifeTime = lifeTime || -1.0;
	}

	public myUpdate(deltaTime: number) {
		this.updatePosition(deltaTime);
		this.updateVelocity(deltaTime);
		this.updateAlfa();
		this.updateLifetime();
		this.elapsedTime += deltaTime;
	}

	private updateVelocity(deltaTime: number) {
		this.velocity.add(
			this.acceleration.clone().multiplyScalar(0.5 * deltaTime)
		);
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
			.add(this.velocity.clone().multiplyScalar(deltaTime))
			.add(
				this.acceleration.clone().multiplyScalar(0.5 * deltaTime * deltaTime)
			);

		this.position.set(pos.x, pos.y, pos.z);
		// console.log(this.position)
	}

	private updateAlfa() {
		this.alfa += this.deltaAlfa;
		this.alfa = Math.max(this.alfa, 0);
		for (let material of this.material as THREE.Material[]) {
			material.opacity = this.alfa;
		}
	}
}

interface IParticleFeatures {
	size: number;
	color: THREE.Color;
	velocity: { min: THREE.Vector3; max: THREE.Vector3 };
	acceleration: { min: THREE.Vector3; max: THREE.Vector3 };
	alfa?: number;
	deltaAlfa?: number;
	mass?: number;
	lifeTime?: number;
}
