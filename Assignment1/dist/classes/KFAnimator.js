class KFAnimator {
    constructor(kfstring) {
        this.currentKF = null;
        this.nextKF = null;
        this.keyframes = [];
        this.u = 0;
        this.controlSpeed = 0.05;
        this.simulate = false;
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
        return new MyKeyframe(this.nextKF.time, new Position(currentPosition.x, currentPosition.y, currentPosition.z), null, qInitial);
    }
    resetFrames() {
        if (!this.simulate) {
            this.currentKFIndex = 0;
            this.nextKFIndex = 1;
            this.currentKF = this.keyframes[this.currentKFIndex];
            this.nextKF = this.keyframes[this.nextKFIndex];
        }
    }
}
//# sourceMappingURL=KFAnimator.js.map