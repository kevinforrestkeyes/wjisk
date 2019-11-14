const anpoorteUrl = 'https://anpoorte.herokuapp.com';
// const anpoorteUrl = 'https://2f419c48.ngrok.io';
// const wizardUrl = 'http://localhost:2222';
const wizardUrl = 'https://popwizard.herokuapp.com/';

export function getDepopProducts() {
	const targetUrl = `${wizardUrl}/get-depop-products`;
	return fetch(targetUrl)
		.then((res) => res.json())
		.then((products) => {
			return products;
		});
}

export function getDepopScrapeInfo() {
	return Promise.all([
		getDepopScrapeStatus()
	]).then( status => ({
		status
	}));
}

export function getDepopScrapeStatus() {
	const targetUrl = `${wizardUrl}/scrape-status`;
	return fetch(targetUrl)
		.then((res) => res.json())
		.then((status) => {
			return status;
		});
}

export function updateDepopProducts() {
	const targetUrl = `${wizardUrl}/update-depop-products`;
	return fetch(targetUrl)
		.then((res) => res.json())
		.then((res) => {
			return res;
		});
}

export function testShopifyEndpoint() {
	const targetUrl = `${anpoorteUrl}/`;
	return fetch(targetUrl)
		.then((res) => res.json())
		.then((res) => {
			console.log(res);
		});
}

export function getShopifyAuthStatus() {
	const targetUrl = `${anpoorteUrl}/get-auth-status`;
	return fetch(targetUrl)
		.then((res) => res.json())
		.then((res) => res);
}

export function getShopifyProducts(clientToken) {
	const targetUrl = `${anpoorteUrl}/get-products`;
	return fetch(`${targetUrl}?clientToken=${clientToken}`)
		.then((res) => res.json())
		.then((res) => res);
}

export function addProductsToShopify(product, clientToken) {
	const targetUrl = `${anpoorteUrl}/add-new-product?clientToken=${clientToken}`;
	return fetch(targetUrl, {
		headers: {
      'Content-Type': 'application/json'
    },
		method: 'POST',
		body: JSON.stringify(product)
	})
	.then((res) => res);
}