class MyKeyframe {
    constructor(time, x, y, z, xa, ya, za, theeta, quat) {
        this.time = time;
        this.pos = new Position(x, y, z);
        if (xa != null && ya != null && za != null && theeta != null) {
            this.orientation = new Orientation(xa, ya, za, theeta);
            this.quat = new THREE.Quaternion();
            this.quat.setFromAxisAngle(new THREE.Vector3(xa, ya, za), toRadians(theeta));
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
        return new MyKeyframe(parseFloat(t), parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(xa), parseFloat(ya), parseFloat(za), parseFloat(theeta), null);
    }
}
//# sourceMappingURL=MyKeyFrame.js.map