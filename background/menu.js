console.log("menu.js loaded");

const apiRunPath = "/api/v1_0/analysis/run/";


function ApiHelper(url, method = 'POST', data = {}) {
	const dict = method === 'POST' ? {
		method: method,
		headers : {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	} : { method: method }

	console.log("dict: ", dict);


    return fetch(url, dict)
    .then(res => res.json())
    .then((result) => {
        console.log(result);
        return result;
    }, (error) => {
        console.log(`ApiHelper Error ${error}`);
    })
}
function checkUrlStatus(url) {
	ApiHelper(new URL("/heartbeat/", item.apiDetails.url), "GET")
	.then(response => {
		if (!response || !response.status) return "Down"
		return response.status || "Down"
	})
}

function getApiSettingsUrl() {
	return browser.storage.local.get("apiDetails")
	.then((item) => {
		if (!item || !item.apiDetails || !item.apiDetails.url) return;
		return item.apiDetails.url
	}, (e) => { console.log(`Error ${e}`)});
}


function submitForAnalysis(inputUrl, apiUrl) {
	return ApiHelper(apiUrl, "POST", {
	  "url": inputUrl,
	  "mode": "single"
	})
	.then(response => {
		console.log("submitUrlBtn response: ", response)
		return response
	})
}

browser.contextMenus.create({
	id: "submit-tab", 
	title: "Analyze in Safe-JS",
	contexts: ['link']
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {
		case "submit-tab":
			console.log("Clicked submit-tab")

			getApiSettingsUrl()
			.then(apiUrl => {
				if (!apiUrl || apiUrl===undefined) return

				const submitUrl = new URL(apiRunPath, apiUrl)
				console.log("submitUrl: ", submitUrl);

				submitForAnalysis(info.linkUrl, submitUrl)
				.then(response => {
					console.log("response: ", response);
				})
			})




			// const apiUrl = getApiSettingsUrl()
			// console.log("apiUrl: ", apiUrl);
			// if (!apiUrl) return 

			// const apiStatus = checkUrlStatus(apiUrl)
			// console.log("apiStatus: ", apiStatus);

			// if (!apiStatus || apiStatus === "Down") return

			// const serverRes = sendUrlToApi(info.linkUrl, apiUrl)
			// console.log("serverRes: ", serverRes);

			break;
		default:
			console.log("Default")
	}
})
