var Pos = (function() {
	var pos = {};
	// will generate a random location in a area around the users current position
	// pos.RandomLocation = function(callback) {
	pos.RandomLocation = function() {

		// get current position
		navigator.geolocation.getCurrentPosition(function(position) {
			// onSucces
			// get user latitude
			var userLat = position.coords.latitude;
			// get user longitude
			var userLng = position.coords.longitude;
			// calculate the radius in which the pokemon will appear
			var radius = 100/111300;	// radius of 100 m
			// generate 2 random values
			var u = Math.random();
			var v = Math.random();

			var w = radius * Math.sqrt(u);
			var t = 2 * Math.PI * v;
			var x = w * Math.cos(t);
			var y1 = w * Math.sin(t);
			var x1 = x / Math.cos(userLat);
			// new generated random location
			var randLoc = {
				latitude: (userLat + y1),
				longitude: (userLng + x1),
			}
			// return random location
			return randLoc;
		}, function(error) {
			// onError
			console.log("code: " + error.code + "\n" +
						"message: " + error.message + "\n");
		}, {
			// options
			maximumAge: 3000,
			timeout: 5000,
			enableHighAccuracy: false
		});
	}

	// will calculate the distance between 2 points
	pos.Distance = function(userLat, userLng, monLat, monLng) {
		var R = 6371000 // meters
		var phi1 = userLat.toRad();
		var phi2 = monLat.toRad();

		var deltaPhi = (monLat - userLat).toRad();
		var deltaLambda = (monLng - userLng).toRad();

		var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
				Math.cos(phi1) * Math.cos(phi2) *
				Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R *c;

		return d;
	}
	// Convert number naar radiaal
	if(typeof(Number.prototype.toRad) === "undefined") {
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		}
	}
	return pos;
})();