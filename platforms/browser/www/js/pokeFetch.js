var mapInit = false,
	map = null,
	myMarker = null,
	myLocation = null,
	wild_pokemon = [],
	// pokeMarker = [],
	encounter = "",
	inEncounter = false;

$(document).on("pageshow", "#pokefetch", function() {
	$.mobile.loading("show");
	navigator.geolocation.getCurrentPosition(function(position) {
		// onSucces
		// if the map is not initialized
		if (!mapInit) {
			// map is not initialized
				// create new map
			setTimeout(function() {
				map = new google.maps.Map(document.getElementById("pokefetchMap"), {
					center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				// map is initialized, set mapInit true
				initialize(position.coords);
				mapInit = true;
			});
		} else {
			// map is initialized
			initialize(position.coords);
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

initialize = function(position) {

	getWildPokemon(position);
	
	updateMyPosition(position);
}

updateMyPosition = function(position) {
	if (myMarker == null) {
		// player marker
		myMarker = new google.maps.Marker({
			position: {
				lat: position.latitude,
				lng: position.longitude
			},
			map: map,
			icon: "./img/mapIcon27x30.png",
			title: "my location"
		});
	} else {
		myMarker.setPosition({
			lat: position.latitude,
			lng: position.longitude
		});
	}
	$.mobile.loading("hide");
}

// (pokeFetch)
// generate random pokemon and assign a location
// required: list of wild pokemon, position of the user
function getWildPokemon(position) {
	console.log("getWildPokemon:: kom ik hier");
	wild_pokemon = [];
	url = "http://mobdevelopment.herokuapp.com/map?lat=" + position.latitude + "&lng=" + position.longitude;
	var wpl = Api.GetData(url);
	wpl.success(function (request) {
		
		$.each(request, function(index, value) {
			
			// console.log(value);
			console.log("POKEMON:: " + value.name + " has been spotted!");
			value.name = value.name.toLowerCase();
			var pos = $('.tiny' + value.name).css('backgroundPosition').match(/\d+/g);

			var pokeMarker = new google.maps.Marker({
				position: {
					lat: value.lat, // position.lat
					lng: value.lng,	// position.lng
				},
				map: map,
				icon: new google.maps.MarkerImage(
					"./img/pokemon_map_sprite_40x30.png",
					new google.maps.Size(40, 30),
  					new google.maps.Point(pos[0], pos[1])	
				),
				title: value.name
			});
			pokeMarker.setMap(map);
			wild_pokemon.push({
				id: value._id,
				pid: value.pid,
				name: value.name,
				lat: value.lat,
				lng: value.lng,
				marker: pokeMarker
			});
		});
		checkDistance(position); // TURNED OFF FOR REBUILDING PURPOSES!!!!!
	});
	wpl.error(function (request, error) {
		// console.log("Request: " + request + "\n" + "Error: " + error + "\n");
		console.log("FAILED:: RETRIEVING WILD DATA");
	});
}

function checkDistance(position) {
	// console.log("checkDistance:: kom ik hier");
	$.each(wild_pokemon, function(index, value) {
		var wild_name = value.name;
		var poke_distance = (Pos.Distance(position.latitude, position.longitude, value.lat, value.lng));
		
		if(poke_distance <= 10) {
			navigator.vibrate(500);
			console.log("DISTANCE:: " + poke_distance + " VANGEN:: " + wild_name);
			window.localStorage.setItem("wildpokemon", wild_name);
			window.localStorage.setItem("wildId", value.id);
			$.mobile.changePage("dialogEncounter.html", { role: "dialog" } );
		}
		else {
			console.log("DISTANCE:: " + poke_distance + " VLUCHTEN:: " + wild_name);
		}
	});
}

$(document).on("pageinit", "#pokemonEncounter", function() {
	console.log("Dialog init::");
	$("#title").text( function() {
		return "A wild " + window.localStorage.getItem("wildpokemon") + " appeared";
	});
});
$(document).on("pageshow", "#pokemonEncounter", function() {
	$("#catchBut").click( function() {
		if($('#big' + window.localStorage.getItem("wildpokemon")).hasClass('isCatchedfalse')) {
			$('#big' + window.localStorage.getItem("wildpokemon")).removeClass('isCatchedfalse').addClass('isCatchedtrue');
			$('#tiny' + window.localStorage.getItem("wildpokemon")).removeClass('isCatchedfalse').addClass('isCatchedtrue');
			console.log("gevangen");

			$.each(wild_pokemon, function (index, wPoke) {
				if (wPoke.id === window.localStorage.getItem("wildId")) {

					var url = "http://mobdevelopment.herokuapp.com/map"
					var encounterPost = Api.PostData(url, {caught: true, pokemon: wPoke.pid, _id: wPoke._id});
	
					encounterPost.success(function (request) {
						console.log(request);
						window.location.replace("index.html");
					});
					encounterPost.error(function (request, error) {
						console.log(request);
						console.log(error);
					});
					wPoke.marker.setMap(null);
					wild_pokemon.splice(index, 1);
					return
				}
			});
		}
	});
	$("#fleeBut").click( function() {
		console.log("fled from a " + window.localStorage.getItem("wildpokemon"));

		$.each(wild_pokemon, function (index, wPoke) {
			if (wPoke.id === window.localStorage.getItem("wildId")) {

				var url = "http://mobdevelopment.herokuapp.com/map"
				var encounterPost = Api.PostData(url, {caught: false, pokemon: wPoke.pid, _id: wPoke._id});

				encounterPost.success(function (request) {
					console.log(request);
					window.location.replace("index.html");
				});
				encounterPost.error(function (request, error) {
					console.log(request);
					console.log(error);
				});
				wPoke.marker.setMap(null);
				wild_pokemon.splice(index, 1);
				return
			}
		});
	});


	function encounter(caught) {
	console.log("kom ik hier");

	if (caught) {
		console.log("kom ik hier");
	
	}
} 
});

