function parseStructure(structureText: string) {
	let lines = structureText.split("\n").map((item) => item.trim());

	let threeSkeletonParts: any = {};

	let skeletonParts: any = {};
	let root = null;
	let rootName = null;
	let currentPart: string = null;
	let partsSequenceForOffset = [];

	for (let line of lines) {
		let parts = line.split(/\s/).map((item) => item.trim());
		switch (parts[0]) {
			case "HIERARCHY":
				break;
			case "OFFSET":
				let offset = parseOffset(parts);
				skeletonParts[currentPart]!.offset = offset;

				let offsetVector = new THREE.Vector3(offset.x, offset.y, offset.z);
				threeSkeletonParts[currentPart].setPosition(offsetVector);

				if (!skeletonParts[currentPart].isRoot) {
					let limbLength = Math.sqrt(
						offset.x * offset.x + offset.y * offset.y + offset.z * offset.z
					);
					let limb = new Limb(limbLength, 0.5);
					const axis = new THREE.Vector3(0, 1, 0);
					limb.setPosition(
						new THREE.Vector3(offset.x / 2, offset.y / 2, offset.z / 2)
					);
					limb.quaternion.setFromUnitVectors(
						axis,
						offsetVector.clone().normalize()
					);
					// limb.setRotationFromAxisAngle(offsetVector, 0);
					threeSkeletonParts[skeletonParts[currentPart].parent].add(limb);
				}
				break;
			case "CHANNELS":
				skeletonParts[currentPart]!.channels = parts.slice(2);
				skeletonParts[currentPart]!.numChannels = parseInt(parts[1]);
				break;
			case "JOINT":
				const newPart = {
					name: parts[1],
					parent: currentPart,
				};

				let joint = new Joint();
				skeletonParts[currentPart].children =
					skeletonParts[currentPart].children || [];
				skeletonParts[currentPart].children.push(newPart);
				threeSkeletonParts[currentPart].add(joint);
				currentPart = parts[1];
				joint.name = currentPart;
				partsSequenceForOffset.push(currentPart);
				skeletonParts[currentPart] = newPart;
				threeSkeletonParts[currentPart] = joint;

				// threeSkeletonParts[skeletonParts[currentPart].parent].add(joint);

				break;
			case "ROOT":
				currentPart = parts[1];
				threeSkeletonParts[currentPart] = new Joint(new THREE.Vector3(0, 0, 0));
				partsSequenceForOffset.push(currentPart);
				skeletonParts[currentPart] = {
					name: parts[1],
					isRoot: true,
				};
				root = skeletonParts[currentPart];
				rootName = currentPart;
				break;
			case "End":
				const endPart = {
					name: currentPart + "End",
					parent: currentPart,
				};
				let endJoint = new Joint();
				skeletonParts[currentPart].children =
					skeletonParts[currentPart].children || [];
				skeletonParts[currentPart].children.push(endPart);
				threeSkeletonParts[currentPart].add(endJoint);
				currentPart = currentPart + "End";
				skeletonParts[currentPart] = endPart;
				threeSkeletonParts[currentPart] = endJoint;
				endJoint.name = currentPart;
				break;
			case "}":
				currentPart = skeletonParts[currentPart].parent;
				break;
			default:
				break;
		}
	}

	return {
		skeletonParts,
		threeSkeletonParts,
		partsSequenceForOffset,
		threeRoot: threeSkeletonParts[rootName],
	};
}

function parseOffset(offsetStringArr: string[]) {
	let offsetsStr = offsetStringArr.slice(1);
	if (offsetsStr.length != 3) {
		throw Error("invalid offset ");
	}
	return {
		x: parseFloat(offsetsStr[0]),
		y: parseFloat(offsetsStr[1]),
		z: parseFloat(offsetsStr[2]),
	};
}
