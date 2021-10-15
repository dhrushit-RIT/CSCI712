class Table extends THREE.Mesh {
	constructor(geometry: THREE.BoxGeometry, material: THREE.MeshBasicMaterial[]) {
		super(geometry, material);
	}

	static async createTable(): Promise<Table> {
		return new Promise((resolve, reject) => {
			const geometry = new THREE.BoxGeometry(22, 16, 2);
			const loader = new THREE.TextureLoader();
			const poolTableTextureSource = "./pool_table/pool_table.png";

			let texture: THREE.Texture;
			loader.loadAsync(poolTableTextureSource).then((tex) => {
				texture = tex;
			});
			const material = new THREE.MeshBasicMaterial({ map: texture });

			resolve(new Table(geometry, materials));
		});
	}
}
