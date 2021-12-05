
class SceneManager {
	private scene: THREE.Scene;
	private platform: Platform;
	private skeleton: MySkeleton;

	constructor(scene: THREE.Scene) {
		this.scene = scene;

		//
		// add things to scene
		//

		// add platform
		this.platform = new Platform();
		// add skeleton
		this.skeleton = new MySkeleton();
	}

	myUpdate(deltaTime: number) {}
}
