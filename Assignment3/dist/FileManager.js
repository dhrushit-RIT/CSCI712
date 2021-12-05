function handleFiles(files) {
    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (fileContent) {
        afterFileLoads(fileContent.target.result);
    };
    reader.readAsText(file);
}
//# sourceMappingURL=FileManager.js.map