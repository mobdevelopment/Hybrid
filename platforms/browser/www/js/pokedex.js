// variables
var pokedex_next = "";
var pokedex_all = [];
var battle_Rapport = [];

// (pokedex_master)
// get all pokemon
// required: url
$(document).on('pageinit', '#pokedexmaster', function() {
	// PokeApi url = "http://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
	// own api url = "http://mobdevelopment.herokuapp.com/pokemon"
	var api_url = "http://mobdevelopment.herokuapp.com/pokemon";
	getPokedexData(api_url);
});

var getPokedexData = function(url) {
	var i = 1;
	$.mobile.loading("show");

	var list = Api.GetData(url);
	list.success(function (request) {
		$.each(request.results, function(index, value) {
			console.log(value.name);
			// pokedex_all.push(value.name);
			fillPokedex(value);
			i++;
		});
		pokedex_next = request.next;
		// console.log(pokedex_next);
	});
	list.error(function (request, error) {
		console.log(request);
		console.log(error);
	});
	$.mobile.loading("hide");

}

var fillPokedex = function(data) {
	$("#pokedex").append(
		"<li id='"+ data.name + "'>" +
			// "<a class='pokemonItem' data-link='" + data.name + "'>" +
			// "<a href='pokedex_detail.html' data-id='" + data.name + "' class='pokemonItem'>" +
			"<a href='pokedex_detail.html?id=" + data.name + "' class='pokemonItem'>" +
				"<span id='big" + data.name + "' class='pokedexsprite " + data.name + " isCatched" + data.isCatched + "'></span>" +
				"<h1>" + data.name + "</h1>" +
			"</a>" +
		"</li>"
	);
	$("#pokedexSprite").append(
		"<li id='"+ data.name + "'>" +
			"<a href='pokedex_detail.html?id=" + data.name + "' class='pokemonItem'>" +
				"<span id='tiny" + data.name + "' class='pokemapsprite tiny" + data.name + " isCatched" + data.isCatched + "'></span>" +
				"<h1>" + data.name + "</h1>" +
			"</a>" +
		"</li>"
	);
}

// (pokedex_detail)
// get single pokemon by id
// required: (url + pokemon_id)
var getPokemonData = function(url, id) {

	if(window.localStorage.getItem(id + "Details") == null) {
		$.mobile.loading("show");
		// console.log("retrieving data");
		url = url + id;
		var pokemon = Api.GetData(url);
		pokemon.success(function (request) {
			// console.log(request);
			fillPokemonDetail(request);
		});
		pokemon.error(function (request, error) {
			console.log(request + "\n" + error + "\n");
		});
	} else {
		// console.log("hallo ik ben gecached");
		$("#pokemon_detail").append(window.localStorage.getItem(id + "Details"));
	}
}

var fillPokemonDetail = function(data) {
	console.log("filling pokemon detail");
	var type = types(data.types);
	var abil = abilities(data.abilities);
	
	var detail ="<div class='pokeDetailTop' id='pokeDetailTop'>" +
					"<div class='pokeDetailTitle' id='pokeDetailTitle'>" +
						"<h1>" + data.name + "</h1>" + "<h1>#" + data.id + "</h1>" +
					"</div>" +
				"</div>" +
				"<div class='pokeDetailLeft' id='pokeDetailLeft'>" +
					"<div class='pokeDetailImage' id='pokeDetailImage'>" +
						"<span class='pokedexsprite " + data.name + "'></span>" +
					"</div>" +
					"<div class='pokeDetailType' id='pokeDetailType'>" +
						type +
					"</div>" +
				"</div>" +
				"<div class='pokeDetailRight' id='pokeDetailRight'>" +
					"<div class='pokeDetailInfo' id='pokeDetailInfo'>" +
						"<ul id='pokeDetailInfoListGeneral'>" +
							"<li>Height: " + data.height + "</li>" + "<li>Weight: " + data.weight + "</li>" +
						"</ul>" +
						"<p>Abilities:</p>" +
						"<ul id='pokeDetailInfoListAbility'>" +
							abil +
						"</ul>" +
					"</div>" +
				"</div>" +
				"<div class='pokeDetailBottom' id='pokeDetailBottom'>" +
				"</div>";
	$("#pokemon_detail").append(detail);
	$.mobile.loading("hide");

	// $("#pokeDetailTitle").append("<h1>" + data.name + "</h1>" + "<h1>#" + data.id + "</h1>");
	// $("#pokeDetailImage").append("<span class='pokedexsprite " + data.name + "'></span>");
	// $("#pokeDetailType").append(types(data.types));
	// $("#pokeDetailInfoListGeneral").append("<li>Height: " + data.height + "</li>" +	"<li>Weight: " + data.weight + "</li>");
	// $("#pokeDetailInfoListAbility").append(abilities(data.abilities));
	//  // $("#pokeDetailMoves").append(moves(data.moves));
	console.log("append done");

	if (window.localStorage.getItem(data.name + "Details") == null) {
		window.localStorage.setItem(data.name + "Details", detail);

		// window.localStorage.setItem(data.name + "Details", JSON.stringify(data));
	}
	$.mobile.loading( 'hide' );
}

var abilities = function(data) {
	var a = "";
	var b = "";
	data.forEach(function(value) {
		b = "<li>" + value.ability.name + "</li>";
		a = a + b;
	});
	return a;
}
var types = function(data) {
	var a = "";
	var b = "";
	data.forEach(function(value) {
		b = "<span class='typesprite " + value.type.name + "'></span>";
		a = b + a;
	});
	return a
}



// (pokeFetch)
// save caught pokemon by id
// required: (url + pokemon_id)
function wildAftermath(wildPokemon, caughtFled) {
	url = "";
	if (caughtFled) {
		if ($('#big'+ wildPokemon.name).hasClass('isCatchedFalse')) {
			$("#big" + wildPokemon.name).removeClass("isCatchedFalse").addClass("isCatchedTrue");
			$("#tiny" + wildPokemon.name).removeClass("isCatchedFalse").addClass("isCatchedTrue");
		}
		$.each(someArray, function(i){
    		if(wild_pokemon[i]._id === wildPokemon._id) {
        		someArray.splice(i,1);
        		break;
    		}
		});
	}
	battle_Rapport.pokemon = wildPokemon;
	battle_Rapport.caught = caughtFled;

	//which variables.
	Api.PostData(url, battle_Rapport);
}



/* could be removed */
// (pokeFetch)
// remove caught/fled pokemon from wild list
// required: (pokemon id && coordinates)

$(document).on('pageshow', '#pokedexdetail', function() {
	// PokeApi url = "http://pokeapi.co/api/v2/pokemon/"
	// own api url = ""
	$.mobile.loading( 'show', { theme: "b", text: "foo", textonly: true });
	var api_url = "http://pokeapi.co/api/v2/pokemon/";
	getPokemonData(api_url, getParameterByName("id"));
});

function getParameterByName(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

/* generation will be done by the api */
/*function genWildPokemon() {

	wPoke.name = pokedex_all[Math.floor(Math.random()*pokedex_all.length)];
	wCoords = Pos.RandomLocation();
	wPoke.lat = wCoords.latitude;
	wPoke.lng = wCoords.longitude;

	var markerPos = $('.tiny' + wPoke.name).css('backgroundPosition').split(" ");

	wPoke.markerX = markerPos[0];
	wPoke.markerY = markerPos[1];
	wild_pokemon.append(wPoke);
	return wPoke;
}*/