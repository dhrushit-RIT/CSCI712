class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return "( " + this.x + " ," + this.y + " ," + this.z + " )";
    }
}
class Orientation {
    constructor(xa, ya, za, theeta) {
        this.xa = xa;
        this.ya = ya;
        this.za = za;
        this.theeta = theeta;
    }
    toString() {
        return ("[( " +
            this.xa +
            " ," +
            this.ya +
            " ," +
            this.za +
            " ), " +
            this.theeta +
            "]");
    }
}
class MyKeyframe {
    constructor(time, x, y, z, xa, ya, za, theeta) {
        this.time = time;
        this.pos = new Position(x, y, z);
        this.orientation = new Orientation(xa, ya, za, theeta);
        this.quat = new THREE.Quaternion();
        this.quat.setFromAxisAngle(new THREE.Vector3(xa, ya, za), theeta);
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
        return new MyKeyframe(parseFloat(t), parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(xa), parseFloat(ya), parseFloat(za), parseFloat(theeta));
    }
}
class KFAnimator {
    constructor(kfstring) {
        this.currentKF = null;
        this.nextKF = null;
        this.keyframes = [];
        this.parseKFString(kfstring);
        this.currentKF = this.keyframes[0];
        this.nextKF = this.keyframes[1];
        this.currentKFIndex = 0;
        this.nextKFIndex = 1;
        this.endTime = this.keyframes[this.keyframes.length - 1].time;
        console.log("end time: " + this.endTime);
    }
    parseKFString(kfstring) {
        let kfArray = [];
        for (let kfstr of kfstring.split("\n")) {
            let kf = MyKeyframe.createFromString(kfstr);
            this.keyframes.push(kf);
        }
    }
    interpolateLinear(numInitial, numFinal, u) {
        return (1 - u) * numInitial + u * numFinal;
    }
    getKFAt(time) {
        if (time > this.endTime) {
            debugger;
            return this.keyframes[this.keyframes.length - 1];
        }
        if (time > this.nextKF.time) {
            this.currentKFIndex += 1;
            this.nextKFIndex += 1;
            this.currentKF = this.keyframes[this.currentKFIndex];
            this.nextKF = this.keyframes[this.nextKFIndex];
        }
        let timeElapsedFromCurrentKF = time - this.currentKF.time;
        let timeDiff = this.nextKF.time - this.currentKF.time;
        let u = timeElapsedFromCurrentKF / timeDiff;
        let initialPosition = this.currentKF.pos;
        let finalPosition = this.nextKF.pos;
        let currentPosition = new Position(this.interpolateLinear(initialPosition.x, finalPosition.x, u), this.interpolateLinear(initialPosition.y, finalPosition.y, u), this.interpolateLinear(initialPosition.z, finalPosition.z, u));
        let initialOrientation = this.currentKF.orientation;
        let finalOrientation = this.nextKF.orientation;
        let qInitial = this.currentKF.quat;
        let qFinal = this.nextKF.quat;
        let qCurrent = qInitial.slerp(qFinal, u);
        return new MyKeyframe(time, currentPosition.x, currentPosition.y, currentPosition.z, qInitial.x, qInitial.y, qInitial.z, qInitial.w);
    }
}
//# sourceMappingURL=utilclasses.js.map