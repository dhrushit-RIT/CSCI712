class Joint extends THREE.Mesh {
    constructor(pos) {
        const geometry = new THREE.SphereGeometry(2);
        const material = new THREE.MeshBasicMaterial({ color: 0xfff0ff00 });
        super(geometry, material);
        if (pos) {
            this.setPosition(pos);
        }
    }
    setPosition(pos) {
        this.position.set(pos.x, pos.y, pos.z);
    }
    setFromFrameInfo(frameInfo) {
        if (frameInfo.Xposition && frameInfo.Yposition && frameInfo.Zposition) {
            this.setPosition(new THREE.Vector3(frameInfo.Xposition, frameInfo.Yposition, frameInfo.Zposition));
        }
        const Xrotation = toRadians(frameInfo.Xrotation) || 0;
        const Yrotation = toRadians(frameInfo.Yrotation) || 0;
        const Zrotation = toRadians(frameInfo.Zrotation) || 0;
        this.quaternion.setFromEuler(new THREE.Euler(Xrotation, Yrotation, Zrotation));
    }
}
//# sourceMappingURL=Joint.js.map