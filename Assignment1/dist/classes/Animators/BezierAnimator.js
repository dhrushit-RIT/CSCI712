class BezierAnimator extends KFAnimator {
    constructor(kfString) {
        super(kfString);
        this.controlPoints = [];
        this.controlPointsAfter = [];
        this.controlPointsBefore = [];
        this.basisMatrix = new THREE.Matrix4();
        this.computeControlPoints(this.keyframes.map((x) => x.pos));
        this.basisMatrix.set(-1, 3, -3, 1, 3, -6, -3, 0, -3, 3, 0, 0, 1, 0, 0, 0);
        this.simulate = true;
    }
    addControlPointAfter(p1, p2, p3) {
        let vectorToAdd = Position.difference(p1, p2);
        let point1 = Position.add(p2, vectorToAdd);
        let controlPoint = Position.difference(point1, p3);
        controlPoint.x /= 2;
        controlPoint.y /= 2;
        controlPoint.z /= 2;
        this.controlPointsAfter.push(controlPoint);
        return controlPoint;
    }
    addControlPointBefore(point, controlPointAfter) {
        let vectorToAdd = Position.difference(point, controlPointAfter);
        let controlPointBefore = Position.add(point, vectorToAdd);
        this.controlPointsBefore.push(controlPointBefore);
    }
    addFirstControlPoints() {
        let vectorToAdd = Position.difference(this.keyframes[2].pos, this.keyframes[1].pos);
        let controlPointAfter = Position.add(this.keyframes[1].pos, vectorToAdd);
        this.controlPointsAfter.push(controlPointAfter);
        this.addControlPointBefore(this.keyframes[0].pos, controlPointAfter);
    }
    addLastControlPoints() {
        let vectorToAdd = Position.difference(this.keyframes[this.keyframes.length - 2].pos, this.keyframes[this.keyframes.length - 1].pos);
        let controlPointAfter = Position.add(this.keyframes[this.keyframes.length - 1].pos, vectorToAdd);
        this.controlPointsAfter.push(controlPointAfter);
        this.addControlPointBefore(this.keyframes[this.keyframes.length - 1].pos, controlPointAfter);
    }
    computeControlPoints(points) {
        this.controlPointsAfter = [];
        this.controlPointsBefore = [];
        this.addFirstControlPoints();
        for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex++) {
            let controlPointAfter = this.addControlPointAfter(points[pointIndex - 1], points[pointIndex], points[pointIndex + 1]);
            this.addControlPointBefore(points[pointIndex], controlPointAfter);
        }
        this.addLastControlPoints();
    }
    interpolateDeCasteljau() {
        return new Position(0, 0, 0);
    }
    interpolateBezier() {
        return this.interpolateDeCasteljau();
    }
    interpolateUsingMatrix() {
        let point1, point2;
        let control1, control2;
        point1 = this.keyframes[this.currentKFIndex].pos;
        point2 = this.keyframes[this.nextKFIndex].pos;
        control1 = this.controlPointsAfter[this.currentKFIndex];
        control2 = this.controlPointsBefore[this.nextKFIndex];
        let uW = 1;
        let uZ = uW * this.u;
        let uY = uZ * this.u;
        let uX = uY * this.u;
        let U = new THREE.Vector4(uX, uY, uZ, uW);
        let controlMatrix = new THREE.Matrix4();
        controlMatrix.set(point1.x, point1.y, point1.z, 0, control1.x, control1.y, control1.z, 0, control2.x, control2.y, control2.z, 0, point2.x, point2.y, point2.z, 0);
        const bezierProduct = new THREE.Matrix4();
        bezierProduct.multiplyMatrices(this.basisMatrix, controlMatrix);
        bezierProduct.transpose();
        U.applyMatrix4(bezierProduct);
        console.log(this.u, controlMatrix);
        return new Position(U.getComponent(0), U.getComponent(1), U.getComponent(2));
    }
    interpolatePosition() {
        return this.interpolateBezier();
    }
}
//# sourceMappingURL=BezierAnimator.js.map