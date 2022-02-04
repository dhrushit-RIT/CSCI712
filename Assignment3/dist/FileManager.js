var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function handleFiles(files) {
    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function (fileContent) {
        afterFileLoads(fileContent.target.result);
    };
    reader.readAsText(file);
}
function readFileFromPath(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filePath, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    afterFileLoads(allText);
                }
            }
        };
        rawFile.send(null);
    });
}
//# sourceMappingURL=FileManager.js.map