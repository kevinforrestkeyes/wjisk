const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

export function getDepopProducts() {
	// only temporary until this is live
	const targetUrl = 'http://hidden-temple-17823.herokuapp.com/get-depop-products';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((products) => {
			return products;
		});
}

export function getDepopScrapeInfo() {
	return Promise.all([
		getDepopLogData(),
		getDepopScrapeStatus()
	]).then(([ log, status ]) => ({
		log,
		status
	}));
}

export function getDepopScrapeStatus() {
	const targetUrl = 'http://hidden-temple-17823.herokuapp.com/scrape-status';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((status) => {
			return status;
		});
}

function getDepopLogData() {
	const targetUrl = 'http://hidden-temple-17823.herokuapp.com/get-log';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((log) => {
			return log;
		});
}

export function updateDepopProducts() {
	const targetUrl = 'http://hidden-temple-17823.herokuapp.com/update-depop-products';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => {
			return res;
		});
}

export function testShopifyEndpoint() {
	const targetUrl = 'https://a45df053.ngrok.io/';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
		});
}

export function getShopifyProducts() {
	const targetUrl = 'https://a45df053.ngrok.io/get-auth-status';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
		});
}