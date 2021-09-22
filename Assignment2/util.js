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
