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
class KFAnimator {
    constructor(kfstring) {
        this.currentKF = null;
        this.nextKF = null;
        this.keyframes = [];
        this.u = 0;
        this.controlSpeed = 0.05;
        this.simulate = true;
        this.parseKFString(kfstring);
        this.currentKF = this.keyframes[0];
        if (this.keyframes.length > 1) {
            this.nextKF = this.keyframes[1];
        }
        else {
            this.nextKF = this.currentKF;
        }
        this.currentKFIndex = 0;
        this.nextKFIndex = 1;
        this.u = -this.controlSpeed;
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
    computeControlVariable(time) {
        if (this.simulate) {
            this.u += this.controlSpeed;
        }
        else {
            let timeElapsedFromCurrentKF = time - this.currentKF.time;
            let timeDiff = this.nextKF.time - this.currentKF.time;
            this.u = timeElapsedFromCurrentKF / timeDiff;
        }
        this.u = Math.min(this.u, 1);
    }
    incrementIndices() {
        if (this.nextKFIndex < this.keyframes.length - 1) {
            if (this.nextKFIndex == 0) {
                this.currentKFIndex = -1;
            }
            this.currentKFIndex += 1;
            this.nextKFIndex += 1;
            this.currentKF = this.keyframes[this.currentKFIndex];
            this.nextKF = this.keyframes[this.nextKFIndex];
        }
        else if (this.simulate) {
            this.currentKFIndex = this.nextKFIndex;
            this.nextKFIndex = 0;
            this.currentKF = this.keyframes[this.currentKFIndex];
            this.nextKF = this.keyframes[this.nextKFIndex];
        }
    }
    updateFrames(time) {
        if (this.simulate) {
            if (this.u >= 1) {
                this.incrementIndices();
                this.u = 0;
            }
        }
        else {
            if (time < this.endTime && time > this.nextKF.time) {
                this.incrementIndices();
                this.u = 0;
            }
        }
    }
    getKFAt(time) {
        this.updateFrames(time);
        this.computeControlVariable(time);
        let initialPosition = this.currentKF.pos;
        let finalPosition = this.nextKF.pos;
        let currentPosition = new Position(this.interpolateLinear(initialPosition.x, finalPosition.x, this.u), this.interpolateLinear(initialPosition.y, finalPosition.y, this.u), this.interpolateLinear(initialPosition.z, finalPosition.z, this.u));
        let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);
        let qFinal = this.nextKF.quat;
        let currentQuat = new THREE.Quaternion();
        qInitial.slerp(qFinal, this.u);
        qInitial.normalize();
        return new MyKeyframe(this.nextKF.time, currentPosition.x, currentPosition.y, currentPosition.z, null, null, null, null, qInitial);
    }
}
//# sourceMappingURL=utilclasses.js.map