class BezierAnimator extends KFAnimator {
	private controlPoints: Position[] = [];
	private controlPointsAfter: Position[] = [];
	private controlPointsBefore: Position[] = [];
	private basisMatrix = new THREE.Matrix4();
	constructor(kfString: string) {
		super(kfString);
		this.computeControlPoints(this.keyframes.map((x) => x.pos));
		// prettier-ignore
		this.basisMatrix.set(
			-1, 3, -3, 1,
			3, -6, -3, 0,
			-3, 3,  0, 0,
			1,  0,  0, 0 
		);

		this.simulate = false;
	}

	addControlPointAfter(p1: Position, p2: Position, p3: Position): Position {
		let vectorToAdd = Position.difference(p1, p2);
		let point1 = Position.add(p2, vectorToAdd);
		let controlPoint: Position = Position.add(point1, p3);
		controlPoint.x /= 2;
		controlPoint.y /= 2;
		controlPoint.z /= 2;
		this.controlPointsAfter.push(controlPoint);
		return controlPoint;
	}

	addControlPointBefore(point: Position, controlPointAfter: Position) {
		let vectorToAdd = Position.difference(controlPointAfter, point);
		let controlPointBefore = Position.add(point, vectorToAdd);
		this.controlPointsBefore.push(controlPointBefore);
	}

	addFirstControlPoints() {
		let vectorToAdd = Position.difference(
			this.keyframes[2].pos,
			this.keyframes[1].pos
		);

		let controlPointAfter = Position.add(this.keyframes[1].pos, vectorToAdd);
		this.controlPointsAfter.push(controlPointAfter);

		this.addControlPointBefore(this.keyframes[0].pos, controlPointAfter);
	}

	addLastControlPoints() {
		let vectorToAdd = Position.difference(
			this.keyframes[this.keyframes.length - 2].pos,
			this.keyframes[this.keyframes.length - 1].pos
		);

		let controlPointAfter = Position.add(
			this.keyframes[this.keyframes.length - 1].pos,
			vectorToAdd
		);
		// controlPointAfter.x /= 2;
		// controlPointAfter.y /= 2;
		// controlPointAfter.z /= 2;

		this.controlPointsAfter.push(controlPointAfter);

		this.addControlPointBefore(
			this.keyframes[this.keyframes.length - 1].pos,
			controlPointAfter
		);
	}

	computeControlPoints(points: Position[]): void {
		this.controlPointsAfter = [];
		this.controlPointsBefore = [];

		this.addFirstControlPoints();

		for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex++) {
			// this.addControlPoint(
			// 	points[pointIndex - 1],
			// 	points[pointIndex],
			// 	points[pointIndex + 1]
			// );
			debugger;
			let controlPointAfter = this.addControlPointAfter(
				points[pointIndex - 1],
				points[pointIndex],
				points[pointIndex + 1]
			);
			this.addControlPointBefore(points[pointIndex], controlPointAfter);
		}

		this.addLastControlPoints();
	}

	interpolateBezier(): Position {
		let point1: Position, point2: Position;
		let control1: Position, control2: Position;

		point1 = this.keyframes[this.currentKFIndex].pos;
		point2 = this.keyframes[this.nextKFIndex].pos;
		control1 = this.controlPointsAfter[this.currentKFIndex];
		control2 = this.controlPointsBefore[this.nextKFIndex];

		let uW = 1;
		let uZ = uW * this.u;
		let uY = uZ * this.u;
		let uX = uY * this.u;
		let U: THREE.Vector4 = new THREE.Vector4(uX, uY, uZ, uW);

		let controlMatrix: THREE.Matrix4 = new THREE.Matrix4();
		// prettier-ignore
		controlMatrix.set(
			point1.x, 	point1.y, 	point1.z, 	0,
			control1.x, control1.y, control1.z, 0,
			control2.x, control2.y, control2.z, 0,
			point2.x, 	point2.y, 	point2.z, 	0,
		);

		const bezierProduct = new THREE.Matrix4();
		bezierProduct.multiplyMatrices(this.basisMatrix, controlMatrix);
		bezierProduct.transpose();

		U.applyMatrix4(bezierProduct);
		// console.log(this.u, controlMatrix);

		return new Position(
			U.getComponent(0),
			U.getComponent(1),
			U.getComponent(2)
		);
	}

	interpolateDeCasteljau(): Position {
		let q0: Position = super.interpolatePosition(
			this.keyframes[this.currentKFIndex].pos,
			this.controlPointsAfter[this.currentKFIndex],
			this.u
		);
		let q1: Position = super.interpolatePosition(
			this.controlPointsAfter[this.currentKFIndex],
			this.controlPointsBefore[this.nextKFIndex],
			this.u
		);
		let q2: Position = super.interpolatePosition(
			this.controlPointsBefore[this.nextKFIndex],
			this.keyframes[this.nextKFIndex].pos,
			this.u
		);

		let r0 = super.interpolatePosition(q0, q1, this.u);
		let r1 = super.interpolatePosition(q1, q2, this.u);

		let p = super.interpolatePosition(r0, r1, this.u);

		return p;
	}

	interpolateOrientation(currentPosition: Position): THREE.Quaternion {
		let currentU = 0;
		let qInitial = new THREE.Quaternion().copy(this.currentKF.quat);
		let qFinal = this.nextKF.quat;
		let currentQ = new THREE.Quaternion();
		while (this.u - currentU > 0.00000000001) {
			if (this.u > currentU) {
				currentQ.set(
					currentQ.x + qFinal.x,
					currentQ.y + qFinal.y,
					currentQ.z + qFinal.z,
					currentQ.w + qFinal.w
				);
				currentU = (currentU + 1) / 2;
			} else {
				currentQ.set(
					currentQ.x + qInitial.x,
					currentQ.y + qInitial.y,
					currentQ.z + qInitial.z,
					currentQ.w + qInitial.w
				);
				currentU /= 2;
			}
		}
		return currentQ;
	}

	interpolatePosition(): Position {
		// return this.interpolateBezier();
		return this.interpolateDeCasteljau();
	}
}
