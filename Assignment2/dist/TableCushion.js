class TableCushion extends THREE.Mesh {
    constructor(geometry, material, length) {
        super(geometry, material);
        this.frictionCoefficient = {
            ball: 0.3,
        };
        this.length = length;
    }
}
//# sourceMappingURL=TableCushion.js.map