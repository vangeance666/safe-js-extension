const apiRunPath = "/api/v1_0/analysis/run/";

function setSuccess(eleId, text) {
	const el = document.getElementById(eleId);
	el.classList.remove('text-success', 'text-danger');
	el.classList.add('text-success');
	el.innerHTML = text;
}

function setError(eleId, text) {
	const el = document.getElementById(eleId);	
	el.classList.remove('text-success', 'text-danger');
	el.classList.add('text-danger');
	el.innerHTML = text;
}

function open(url, active = true) {
    chrome.tabs.create({ url, active })
}

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


function setApiUrlStatus() {
	browser.storage.local.get("apiDetails")
	.then((item) => {
		if (!item || !item.apiDetails || !item.apiDetails.url) return;
		
		ApiHelper(new URL("/heartbeat/", item.apiDetails.url), "GET")
		.then(response => {		
			document.querySelector("#server-status-reply").innerHTML = response.status || "Down"
		})

	}, (e) => { console.log(`Error ${e}`)});
}


document.addEventListener("DOMContentLoaded", function() {

	const settingsBtn = document.getElementById("settings-btn");
	const serverStatusReply = document.getElementById("server-status-reply");
	const analyzeUrlInput = document.getElementById("analyze-url-input");
	const submitUrlBtn = document.getElementById("submit-url-btn");
	const goResultsBtn = document.getElementById("go-results-btn");

	setApiUrlStatus();

	document.querySelector("#server-status-reply").innerHTML = "Down";	


	settingsBtn.addEventListener("click", (e) => {
		browser.runtime.openOptionsPage();		
		console.log("settings click")
	});


	submitUrlBtn.addEventListener("click", (e) => {
		e.preventDefault();

		const inputUrl = document.getElementById("analyze-url-input").value

		if (!inputUrl) return
		console.log("inputUrl: ", inputUrl);

		browser.storage.local.get("apiDetails")
		.then((item) => {
			if (!item || !item.apiDetails || !item.apiDetails.url) return;
			
			const apiUrl = new URL(apiRunPath, item.apiDetails.url)

			console.log("apiUrl: ", apiUrl);

			ApiHelper(apiUrl, "POST", {
			  "url": inputUrl,
			  "mode": "single"
			})
			.then(response => {
				console.log("submitUrlBtn response: ", response)

				if (!response || !response.status)
					setError("feedback-label", "Failed to submit")

				setSuccess("feedback-label", response.status === "ok" 
				? `Assigned Page: ${response.page_id}` : `Assigned Page: Nothing`)

			})

		}, (e) => { console.log(`browser.storage.local rror ${e}`)});
	});

	goResultsBtn.addEventListener("click", (e) => {
		e.preventDefault();

		browser.storage.local.get("apiDetails")
		.then((item) => {
			if (!item || !item.apiDetails || !item.apiDetails.url) {
				console.log("!item || !item.apiDetails || !item.apiDetails.url")
				return	
			}
			console.log("Before open")
			open(item.apiDetails.url)
		}, (e) => {
			console.log(`Error: ${e}`);
		});

		// window.open("https://www.w3schools.com");

	});


});