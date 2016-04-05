var login_token = ""

$(document).on('pageshow', '#login', function() {
	$("#loginSubmit").click( function() {
		var loginName = document.getElementById("loginName").value;
		var loginPass = document.getElementById("loginPassword").value;
		console.log(loginName + "  " + loginPass);

		var url = "http://mobdevelopment.herokuapp.com/users/login"
		
		var loginPost = Api.PostData(url, {username: loginName , password: loginPass});
		
		loginPost.success(function (request) {
			console.log(request);
			login_token = request.token;
			window.location.replace("index.html");
		});
		loginPost.error(function (request, error) {
			console.log(request);
			console.log(error);
			alert("Username and/or password was incorrect");
		});

	});
});

$(document).on('pageshow', '#register', function() {
	$("#registerSubmit").click( function() {
		var regisName = document.getElementById("registerName").value;
		var regisPass = document.getElementById("registerPassword").value;
		console.log(regisName + "  " + regisPass);

		var url = "http://mobdevelopment.herokuapp.com/users/signup"
		var regisPost = Api.PostData(url, {username: regisName , password: regisPass});

		regisPost.success(function (request) {
			console.log(request);
			login_token = request.token;
			window.location.replace("index.html");
		});
		regisPost.error(function (request, error) {
			console.log(request);
			console.log(error);
		});
	});
});

