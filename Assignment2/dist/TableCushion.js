class TableCushion extends THREE.Mesh {
    constructor(geometry, material, length, surfaceNormal) {
        super(geometry, material);
        this.frictionCoefficient = {
            ball: 0.3,
        };
        this.length = length;
        this.surfaceNormal = surfaceNormal;
    }
    getSurfaceNormal() {
        return this.surfaceNormal;
    }
}
//# sourceMappingURL=TableCushion.js.map