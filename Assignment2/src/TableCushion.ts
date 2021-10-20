class TableCushion extends THREE.Mesh {
	private length: number;
	private surfaceNormal: THREE.Vector3;
	private frictionCoefficient = {
		ball: 0.3,
	};

	constructor(
		geometry: THREE.BoxGeometry,
		material: THREE.MeshBasicMaterial[],
		length: number,
		surfaceNormal: THREE.Vector3
	) {
		super(geometry, material);
		this.length = length;
		this.surfaceNormal = surfaceNormal;
	}

	getSurfaceNormal(): THREE.Vector3 {
		return this.surfaceNormal;
	}
}
