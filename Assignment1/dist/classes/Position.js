class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(pos) {
        return new Position(pos.x, pos.y, pos.z);
    }
    toString() {
        return "( " + this.x + " ," + this.y + " ," + this.z + " )";
    }
    static difference(posInitial, posFinal) {
        return new Position(posFinal.x - posInitial.x, posFinal.y - posInitial.y, posFinal.z - posInitial.z);
    }
    static add(posInitial, posFinal) {
        return new Position(posFinal.x + posInitial.x, posFinal.y + posInitial.y, posFinal.z + posInitial.z);
    }
}
//# sourceMappingURL=Position.js.map