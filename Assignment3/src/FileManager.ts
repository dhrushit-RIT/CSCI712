function handleFiles(files: any) {
	let file = this.files[0];

	const reader = new FileReader();
	reader.onload = function (fileContent) {
		afterFileLoads(fileContent.target.result as string);
	};
	reader.readAsText(file);
}

async function readFileFromPath(filePath: string) {
	// const fileText = 
	// afterFileLoads(fileText);

	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filePath, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                afterFileLoads(allText);
            }
        }
    }
    rawFile.send(null);
}


// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }