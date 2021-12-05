function handleFiles(files: any) {
	let file = this.files[0];

	const reader = new FileReader();
	reader.onload = function (fileContent) {
		afterFileLoads(fileContent.target.result as string);
	};
	reader.readAsText(file);
}
