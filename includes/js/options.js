console.log("options.js loaded----");


function saveOptions(e) {
	e.preventDefault();

	let ele = document.getElementById("input-api-url");

	if (ele) {
		console.log("ele: ", ele);
		var apiDetails = {"url": ele.value}
		browser.storage.local.set({apiDetails});		
	}

}

function restoreOptions() {

	function setServerUrl(item) {
		console.log("setServerUrl: ");

		if (!item || !item.apiDetails || !item.apiDetails.url) {
			console.log("!item || !item.apiDetails || !item.apiDetails.url")
			return
		}

		document.querySelector("#input-api-url").value = item.apiDetails.url || "";
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	let getting = browser.storage.local.get("apiDetails");
	getting.then(setServerUrl, onError);
}

document.addEventListener("DOMContentLoaded", function() {
	restoreOptions();
	document.querySelector("#save-button").addEventListener("click", saveOptions);
});
