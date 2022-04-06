function open(url, active = true) {
    chrome.tabs.create({ url, active })
}

function setApiUrlStatus() {
	console.log("setApiUrlStatus");
	// GET Settings url then send GET request to that url
	function setStatusText(item) {

		if (!item || !item.apiDetails || !item.apiDetails.url) {
			console.log("!item || !item.apiDetails || !item.apiDetails.url")
			return	
		} 

		function reqListener () {
	  		if (this.status == 200 && this.responseText) {
	  			let data = JSON.parse(this.responseText)
	  			document.querySelector("#server-status-reply").innerHTML = data['status'];
	  		}
		}

		let settingsUrl = item.apiDetails.url
		let heartBeatUrl = new URL("/heartbeat/", settingsUrl)
		let oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", heartBeatUrl);
		oReq.send();
	}

	function onError(e) {
		console.log(`Error: ${e}`);
	}

	let getting = browser.storage.local.get("apiDetails");
	getting.then(setStatusText, onError);
}

function submitUrl() {
	// Get textbox value
	// 
	// Check if API UP,
	// POST to api URL,
}


document.addEventListener("DOMContentLoaded", function() {

	const settingsBtn = document.getElementById("settings-btn");
	const serverStatusReply = document.getElementById("server-status-reply");
	const analyzeUrlInput = document.getElementById("analyze-url-input");
	const submitUrlBtn = document.getElementById("submit-url-btn");
	const goResultsBtn = document.getElementById("go-results-btn");

	setApiUrlStatus();


	// Set default, if On will change to Healthy
	document.querySelector("#server-status-reply").innerHTML = "Down";	

	// let getting = browser.storage.local.get("apiDetails");


	settingsBtn.addEventListener("click", function(e) {
		browser.runtime.openOptionsPage();		
		console.log("settings click")
	});


	submitUrlBtn.addEventListener("click", function(e) {
		e.preventDefault();

		let urlToAnalyze = document.getElementById("analyze-url-input").value

		console.log("urlToAnalyze: ", urlToAnalyze);

	});

	goResultsBtn.addEventListener("click", function(e) {

		function redirectToSettings(item) {
			console.log("item: ", item);
			if (!item || !item.apiDetails || !item.apiDetails.url) {
				console.log("!item || !item.apiDetails || !item.apiDetails.url")
				return	
			}
			console.log("Before open")
			open(item.apiDetails.url)
		}

		function onError(e) {
			console.log(`Error: ${e}`);
		}

		e.preventDefault();
		let getting = browser.storage.local.get("apiDetails");
		console.log("getting: ", getting);


		getting.then(redirectToSettings, onError);

		// window.open("https://www.w3schools.com");

	});


});