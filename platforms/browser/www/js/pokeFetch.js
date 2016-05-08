var mapInit = false,
	encounter = false,
	map = null,
	myMarker = null,
	myLocation = null,
	wild_pokemon = [];
	pokeMarker = [];

$(document).on("pageshow", "#pokefetch", function() {
	navigator.geolocation.getCurrentPosition(function(position) {
		// onSucces
		// if the map is not initialized
		if (!mapInit) {
			// map is not initialized
				// create new map

				map = new google.maps.Map(document.getElementById("pokefetchMap"), {
					center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});
				// player marker
				myMarker = new google.maps.Marker({
					position: {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					},
					map: map,
					icon: "./img/mapIcon27x30.png",
					title: "my location"
				});
				myMarker.setMap(map);

				// map is initialized, set mapInit true
				mapInit = true;

				getWildPokemon(position.coords);

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
// function getRealContentHeight() {
// 	var header = $.mobile.activePage.find("div[data-role='header']:visible");
// 	var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
// 	var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
// 	var viewport_height = $(window).height();
	
// 	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
// 	if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
// 	    content_height -= (content.outerHeight() - content.height());
// 	} 
// 	return content_height;
// }

// (pokeFetch)
// generate random pokemon and assign a location
// required: list of wild pokemon, position of the user
function getWildPokemon(position) {

	url = "http://mobdevelopment.herokuapp.com/map?lat=" + position.latitude + "&lng=" + position.longitude;
	var wpl = Api.GetData(url);
	wpl.success(function (request) {
		$.each(request, function(index, value) {
			wild_pokemon.push(value);
			console.log(wild_pokemon);
			// console.log(value.name);
			value.name = value.name.toLowerCase();
			var pos = $('.tiny' + value.name).css('backgroundPosition').match(/\d+/g);

					var pokeMarker = new google.maps.Marker({
						position: {
							lat: value.lat, // position.lat
							lng: value.lng,	//position.lng
						},
						map: map,
						icon: new google.maps.MarkerImage(
							"./img/pokemon_map_sprite_40x30.png",
							new google.maps.Size(40, 30),
  							new google.maps.Point(pos[0], pos[1])	
						),
						// icon: { "./img/pokemon_map_sprite_40x30.png",
								// ,},
						title: value.name
					});
					pokeMarker.setMap(map);
		});

		checkDistance(position);
	});
	wpl.error(function (request, error) {
		console.log(request);
		console.log(error);
	});
}

function checkDistance(position) {
	$.each(wild_pokemon, function(index, value) {
		if((Pos.Distance(position.latitude, position.longitude, value.lat, value.lng)) <= 20) {
			navigator.vibrate(1000);
			console.log("ik kan een pokemon vangen");
			// $("#encounter")
			$.mobile.changePage( "path/to/encounter.html", { role: "dialog" } );
		}
		else {
			console.log("nothing close");
			navigator.vibrate(500);
			navigator.vibrate(500);
			// navigator.vibrate(1000);


			// $("#encounter .title").text("A wild " + value.name + " appeared!");
			// $("#encounter .catchBut").bind("click", function*() {
			// 	$(this).unbind("click");
			// 	$("#encounter .fleeBut").unbind("click");
			// });
			// $("#encounter .fleeBut").bind("click", function*() {

			// });
			$.mobile.changePage("#encounter");
		}
	});
}