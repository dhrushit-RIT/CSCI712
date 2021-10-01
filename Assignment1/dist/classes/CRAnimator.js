class CRAnimator {
    constructor(kfstring) {
        this.currentKF = null;
        this.nextKF = null;
        this.keyframes = [];
        this.u = 0;
        this.controlSpeed = 0.02;
        this.simulate = false;
        this.totalKFs = -1;
        this.basisMatrix = new THREE.Matrix4();
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
        this.startFrame = this.computeStartFrame();
        this.endFrame = this.computeEndFrame();
        this.basisMatrix.set(-0.5, 1.5, -1.5, 0.5, 1, -2.5, 2, -0.5, -0.5, 0, 0.5, 0, 0, 1, 0, 0);
    }
    computeStartFrame() {
        return new MyKeyframe(-this.keyframes[1].time, Position.difference(this.keyframes[1].pos, this.keyframes[0].pos), this.keyframes[0].orientation, null);
    }
    computeEndFrame() {
        return new MyKeyframe(2 * this.keyframes[this.totalKFs - 1].time -
            this.keyframes[this.totalKFs - 2].time, Position.add(Position.difference(this.keyframes[this.totalKFs - 2].pos, this.keyframes[this.totalKFs - 1].pos), this.keyframes[this.totalKFs - 1].pos), this.keyframes[this.totalKFs - 1].orientation, null);
    }
    parseKFString(kfstring) {
        let kfArray = [];
        for (let kfstr of kfstring.split("\n")) {
            let kf = MyKeyframe.createFromString(kfstr);
            this.keyframes.push(kf);
        }
        this.totalKFs = this.keyframes.length;
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
    interpolateCatmulRom() {
        let p1, p2, p3, p4;
        if (this.keyframes.length < 3) {
            p1 = this.startFrame.pos;
            p2 = this.keyframes[0].pos;
            p3 = this.keyframes[1].pos;
            p4 = this.endFrame.pos;
        }
        else if (this.currentKFIndex == 0) {
            p1 = this.startFrame.pos;
            p2 = this.keyframes[0].pos;
            p3 = this.keyframes[1].pos;
            p4 = this.keyframes[2].pos;
        }
        else if (this.nextKFIndex == this.keyframes.length - 1) {
            p1 = this.keyframes[this.totalKFs - 3].pos;
            p2 = this.keyframes[this.totalKFs - 2].pos;
            p3 = this.keyframes[this.totalKFs - 1].pos;
            p4 = this.endFrame.pos;
        }
        else {
            p1 = this.keyframes[this.currentKFIndex - 1].pos;
            p2 = this.keyframes[this.currentKFIndex].pos;
            p3 = this.keyframes[this.nextKFIndex].pos;
            p4 = this.keyframes[this.nextKFIndex + 1].pos;
        }
        let uW = 1;
        let uZ = uW * this.u;
        let uY = uZ * this.u;
        let uX = uY * this.u;
        let U = new THREE.Vector4(uX, uY, uZ, uW);
        let controlMatrix = new THREE.Matrix4();
        controlMatrix.set(p1.x, p1.y, p1.z, 0, p2.x, p2.y, p2.z, 0, p3.x, p3.y, p3.z, 0, p4.x, p4.y, p4.z, 0);
        const catmulProduct = new THREE.Matrix4();
        catmulProduct.multiplyMatrices(this.basisMatrix, controlMatrix);
        console.log(catmulProduct);
        catmulProduct.transpose();
        U.applyMatrix4(catmulProduct);
        return new Position(U.getComponent(0), U.getComponent(1), U.getComponent(2));
    }
    getKFAt(time) {
        this.updateFrames(time);
        this.computeControlVariable(time);
        console.log(this.u);
        let initialPosition = this.currentKF.pos;
        let finalPosition = this.nextKF.pos;
        let currentPosition = this.interpolateCatmulRom();
        let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);
        let qFinal = this.nextKF.quat;
        let currentQuat = new THREE.Quaternion();
        qInitial.slerp(qFinal, this.u);
        qInitial.normalize();
        return new MyKeyframe(this.nextKF.time, new Position(currentPosition.x, currentPosition.y, currentPosition.z), null, qInitial);
    }
}
//# sourceMappingURL=CRAnimator.js.map