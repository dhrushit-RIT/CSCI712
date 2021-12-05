class Limb extends THREE.Mesh {
	constructor(len: number, rad: number) {
		const geometry = new THREE.CylinderGeometry(rad, rad, len, 20, 32);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff00 });
		super(geometry, material);
	}

	setPosition(pos: THREE.Vector3): void {
		this.position.set(pos.x, pos.y, pos.z);
	}
}
