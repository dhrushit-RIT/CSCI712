class TableCushion extends THREE.Mesh {
    private length:number;
    private frictionCoefficient = {
		ball: 0.3,
	};

    constructor(geometry: THREE.BoxGeometry, material: THREE.MeshBasicMaterial[], length: number){
        super(geometry, material);
        this.length = length;
    }
}