var loadTextResource = function (url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", url + "?please-dont-cache=" + Math.random(), true);
        request.onload = function () {
            if (request.status < 200 || request.status > 299) {
                reject("Error: HTTP Status " + request.status + " on resource " + url);
            }
            else {
                resolve(request.responseText);
                return;
            }
        };
        request.send();
    });
};
var parseKFString = function (kfString) {
    let kfArray = [];
    for (let kfstr of kfString.split("\n")) {
        let WHITE_SPACE_RE = /[ ,]+/;
        let [t, x, y, z, xa, ya, za, theeta] = kfstr.trim().split(WHITE_SPACE_RE);
        let kf = new MyKeyframe(parseFloat(t), new Position(parseFloat(x), parseFloat(y), parseFloat(z)), new Orientation(parseFloat(xa), parseFloat(ya), parseFloat(za), parseFloat(theeta)), null);
        kfArray.push(kf);
    }
    return kfArray;
};
var toRadians = function (degrees) {
    return (degrees * Math.PI) / 180;
};
var toDegrees = function (radians) {
    return (radians * 180) / Math.PI;
};
//# sourceMappingURL=util.js.map