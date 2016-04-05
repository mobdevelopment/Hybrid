var mapInit = false,
	encounter = false,
	map = null,
	marker = null,
	myLocation = null;

$(document).on("pageshow", "#pokefetch", function() {
	navigator.geolocation.getCurrentPosition(function(position) {
		// onSucces
		// if the map is not initialized
		if (!mapInit) {
			// map is not initialized
			setTimeout(function() {
				// create new map
				map = new google.maps.Map(document.getElementById("pokefetchMap"), {
					center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});
				// player marker
				marker = new google.maps.Marker({
					position: {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					},
					map: map,
					icon: "./img/mapIcon27x30.png",
					// icon: {
					// 	size: new google.maps.Size(40, 30),
					// }
					title: "my location"
				});
				marker.setMap(map);

				// map is initialized, set mapInit true
				// mapInit = true;
			});
			// $('.bulbasaur').height();
			// console.log($('.bulbasaur').height());
			var pos = $('.tinycelebi').css('backgroundPosition').split(" ");
			console.log(pos);
			console.log(pos[0]);
			console.log(pos[1]);
			// $('.bulbasaur').height();
			// console.log($('.bulbasaur').height());
			// var pos = [$('.bulbasaur').css("background-position-x"),
                		// $('.bulbasaur').css("background-position-y")];
			// var pos = $('.tinybulbasaur').attr('backround-position');
			// console.log(pos);
			// console.log(pos[0]);
			// console.log(pos[1]);
		} else {
			// map is initialized

		}
	}, function(error) {
		// onError
		console.log("code: " + error.code + "\n" +
					"message: " + error.message + "\n");
	}, {
		// options
		maximumAge: 3000,
		timeout: 5000,
		enableHighAccuracy: true
	});
});