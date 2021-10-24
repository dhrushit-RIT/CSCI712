class TableCushion extends THREE.Mesh {
    constructor(name, geometry, material, length, surfaceNormal) {
        super(geometry, material);
        this.frictionCoefficient = {
            ball: 0.3,
        };
        this.name = name;
        this.length = length;
        this.surfaceNormal = surfaceNormal;
    }
    getSurfaceNormal() {
        return this.surfaceNormal;
    }
}
//# sourceMappingURL=TableCushion.js.map