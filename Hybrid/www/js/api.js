var Api = (function() {
	var api = {};

	api.GetData = function(url) {
		return $.ajax({
			url: url,
			// type: "GET",
			dataType: "json",
			async: true,
			// succes: function(data) {
			// 	return console.log(data);
			// },
			// error: function(msg) {
			// 	console.log(msg);
			// }
		});
	}
	
	api.PostData = function(url, data) {
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			// succes: succes,
			error: function (msg) {
				console.log(msg);
			}
		});
	}
	return api;
})();