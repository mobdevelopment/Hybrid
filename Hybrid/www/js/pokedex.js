// variables
var pokedex_next = "";
var currentDetail;
// (pokedex_master)
// get all pokemon
// required: url
$(document).on('pageinit', '#pokedexmaster', function() {
	// PokeApi url = "http://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
	// own api url = ""
	var api_url = "http://pokeapi.co/api/v2/pokemon/?limit=720&offset=0";
	getPokedexData(api_url);
});

var getPokedexData = function(url) {

	var list = Api.GetData(url);
	list.success(function (request) {
		$.each(request.results, function(index, value) {
			// console.log(value.name);
			fillPokedex(value);
		});
		pokedex_next = request.next;
	});
	list.error(function (request, error) {
		console.log(request + "\n" + error + "\n");
	});
}

var fillPokedex = function(data) {
	$("#pokedex").append(
		"<li id='"+ data.name + "'>" +
			// "<a class='pokemonItem' data-link='" + data.name + "'>" +
			// "<a href='pokedex_detail.html' data-id='" + data.name + "' class='pokemonItem'>" +
			"<a href='pokedex_detail.html?id=" + data.name + "' class='pokemonItem'>" +
				"<span class='pokedexsprite " + data.name + "'></span>" +
				"<h1>" + data.name + "</h1>" +
			"</a>" +
		"</li>"
	);
}

// (pokedex_detail)
// get single pokemon by id
// required: (url + pokemon_id)
var getPokemonData = function(url) {
	console.log("retrieving data");
	var pokemon = Api.GetData(url);
	pokemon.success(function (request) {
		// console.log(request);
		fillPokemonDetail(request);
	});
	pokemon.error(function (request, error) {
		console.log(request + "\n" + error + "\n");
	});
}

var fillPokemonDetail = function(data) {
	// console.log(data);
	console.log(data.abilities);
	abil = abilities(data.abilities);
	type = types(data.types);
	var info ="<div class='pokeDetailName'>" +
			"<h1>" + data.name + "</h1>" +
			"<h1>#" + data.id + "</h1>" +
		"</div>" +
		"<div class='pokeDetailImage'>" +
			"<span class='pokedexsprite'" + data.name + "></span>" +
		"</div>" +
		"<div class='pokeDetailInfo'>" +
			"<ul class='pokeDetailInfoList'>" +
				"<li>Height: " + data.height + "</li>" +
				"<li>Weight: " + data.weight + "</li>" +
				"<li>" +
					"<ul class='pokeDetailInfoAbilityList'><p>Abilities:</p>" +
					abil +
					"</ul>" +
				"</li>" +
			"</ul>" +
		"</div>"
	$("#pokemon_detail").append(info);
}

var abilities = function(data) {
	var a = "";
	var b = "";
	data.forEach(function(value) {
		b = "<li>" + value.ability.name + "</li>";
		a = a + b;
	});
	console.log(a);
	return a;
}
var types = function(data) {
	var a;
	var b;
	data.forEach(function(value) {
		b = "<span class='typesprite " + value.type.name + "'></span>";
		a = a + b;
	});
	return a;
}
// (pokeFetch)
// save caught pokemon by id
// required: (url + pokemon_id)


// (pokeFetch)
// generate random pokemon and assign a location
// required: list of wild pokemon

// (pokeFetch)
// remove caught/fled pokemon from wild list
// required: (pokemon id && coordinates)

$(document).on('pageshow', '#pokedexdetail', function() {
	// PokeApi url = "http://pokeapi.co/api/v2/pokemon/"
	// own api url = ""
	var api_url = "http://pokeapi.co/api/v2/pokemon/" + getParameterByName("id");
	getPokemonData(api_url);
});

function getParameterByName(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}