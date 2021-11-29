class MyKeyframe {
    constructor(time, pos, orientation, quat) {
        this.time = time;
        this.pos = pos;
        if (orientation != null) {
            this.orientation = orientation;
            this.quat = new THREE.Quaternion();
            this.quat.setFromAxisAngle(new THREE.Vector3(orientation.xa, orientation.ya, orientation.za), toRadians(orientation.theeta));
        }
        else {
            this.quat = new THREE.Quaternion().copy(quat);
        }
        this.quat.normalize();
    }
    toString() {
        return this.time + " " + this.pos + " " + this.orientation;
    }
    getTime() {
        return this.time;
    }
    getPosition() {
        return this.pos;
    }
    static createFromString(kfString) {
        let WHITE_SPACE_RE = /[ ,]+/;
        let [t, x, y, z, xa, ya, za, theeta] = kfString.split(WHITE_SPACE_RE);
        return new MyKeyframe(parseFloat(t), new Position(parseFloat(x), parseFloat(y), parseFloat(z)), new Orientation(parseFloat(xa), parseFloat(ya), parseFloat(za), parseFloat(theeta)), null);
    }
}
//# sourceMappingURL=MyKeyFrame.js.map