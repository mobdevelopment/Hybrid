var mapInit = false,
	encounter = false,
	map = null,
	marker = null,
	myLocation = null,
	wild_pokemon = [];


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
				marker = new google.maps.Marker({
					position: {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					},
					map: map,
					icon: "./img/mapIcon27x30.png",
					title: "my location"
				});
				marker.setMap(map);

				// map is initialized, set mapInit true
				// mapInit = true;

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


// (pokeFetch)
// generate random pokemon and assign a location
// required: list of wild pokemon, position of the user
function getWildPokemon(position) {

	url = "http://mobdevelopment.herokuapp.com/map?lat=" + position.latitude + "&lng=" + position.longitude;
	var wpl = Api.GetData(url);
	wpl.success(function (request) {
		$.each(request, function(index, value) {
			console.log(value);
			wild_pokemon.push(value);
			console.log(value.name);
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
		console.log(wild_pokemon);
		return wild_pokemon;
	});
	wpl.error(function (request, error) {
		console.log(request);
		console.log(error);
	});
}



// catch eventueel token


// at event
$("#dialogbox").dialog({
    autoOpen:false,
    modal:true,
    title: "",
    width:300,
    open: function( event, ui ) {
        alert('battle');
    }
});

$('#dialogbox').html('<h2>pokemon_name found</h2><button>catch</button><button>flee</button>');
    $('#dialogbox').dialog('open');

$( ".selector" ).on( "dialogopen", function( event, ui ) {} );

$.mobile.changePage( "path/to/dialog.html", { role: "dialog" } );









    