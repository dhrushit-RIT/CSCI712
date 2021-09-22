var loadTextResource = function (url) {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open("GET", url + "?please-dont-cache=" + Math.random(), true);
		request.onload = function () {
			if (request.status < 200 || request.status > 299) {
				reject("Error: HTTP Status " + request.status + " on resource " + url);
			} else {
				// callback(null, request.responseText);
				resolve(request.responseText);
				return;
			}
		};
		request.send();
	});
};

var parseKFString = function (kfString) {
	let kfArray = [];

	for (let kfstr of kfstring.split("\n")) {
		let WHITE_SPACE_RE = /[ ,]+/;
		let [t, x, y, z, xa, ya, za, theeta] = kfstr.split(WHITE_SPACE_RE);
		let kf = new Keyframe(
			parseFloat(t),
			parseFloat(x),
			parseFloat(y),
			parseFloat(z),
			parseFloat(xa),
			parseFloat(ya),
			parseFloat(za),
			parseFloat(theeta)
		);
		kfArray.push(kf);
	}

	return kfArray;
};

// module.exports = {
// 	loadTextResource
// }
