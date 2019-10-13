// only temporary until this is live
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
// const anpoorteUrl = 'https://anpoorte.herokuapp.com'
const anpoorteUrl = 'https://f420deb1.ngrok.io'
const denishokuUrl = 'http://denishoku.herokuapp.com';

export function getDepopProducts() {
	const targetUrl = `${denishokuUrl}/get-depop-products`;
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
	const targetUrl = `${denishokuUrl}/scrape-status`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((status) => {
			return status;
		});
}

function getDepopLogData() {
	const targetUrl = `${denishokuUrl}/get-log`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((log) => {
			return log;
		});
}

export function updateDepopProducts() {
	const targetUrl = `${denishokuUrl}/update-depop-products`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => {
			return res;
		});
}

export function testShopifyEndpoint() {
	const targetUrl = `${anpoorteUrl}/`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
		});
}

export function getShopifyAuthStatus() {
	const targetUrl = `${anpoorteUrl}/get-auth-status`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => res);
}

export function getShopifyProducts() {
	const targetUrl = `${anpoorteUrl}/get-products`;
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((res) => res);
}

export function addProductsToShopify(product) {
	const targetUrl = `${anpoorteUrl}/add-new-product`;
	console.log(product);
	console.log(JSON.stringify(product));
	return fetch(proxyUrl+targetUrl, {
		headers: {
      'Content-Type': 'application/json'
    },
		method: 'POST',
		body: JSON.stringify(product)
	})
	.then((res) => console.log(res));
}