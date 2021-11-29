class CRAnimator extends KFAnimator {
    constructor(kfstring) {
        super(kfstring);
        this.basisMatrix = new THREE.Matrix4();
        this.startFrame = this.computeStartFrame();
        this.endFrame = this.computeEndFrame();
        this.basisMatrix.set(-0.5, 1.5, -1.5, 0.5, 1, -2.5, 2, -0.5, -0.5, 0, 0.5, 0, 0, 1, 0, 0);
    }
    interpolatePosition(initialPosition, finalPosition, u) {
        return this.interpolateCatmulRom();
    }
    computeStartFrame() {
        return new MyKeyframe(-this.keyframes[1].time, Position.add(this.keyframes[0].pos, Position.difference(this.keyframes[1].pos, this.keyframes[0].pos)), this.keyframes[0].orientation, null);
    }
    computeEndFrame() {
        return new MyKeyframe(2 * this.keyframes[this.totalKFs - 1].time -
            this.keyframes[this.totalKFs - 2].time, Position.add(Position.difference(this.keyframes[this.totalKFs - 2].pos, this.keyframes[this.totalKFs - 1].pos), this.keyframes[this.totalKFs - 1].pos), this.keyframes[this.totalKFs - 1].orientation, null);
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
        catmulProduct.transpose();
        U.applyMatrix4(catmulProduct);
        return new Position(U.getComponent(0), U.getComponent(1), U.getComponent(2));
    }
}
//# sourceMappingURL=CRAnimator.js.map