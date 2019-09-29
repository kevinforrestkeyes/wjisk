export function getDepopProducts() {
	// only temporary until this is live
	const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
	const targetUrl = 'http://hidden-temple-17823.herokuapp.com/get-depop-products';
	return fetch(proxyUrl+targetUrl)
		.then((res) => res.json())
		.then((products) => {
			return products;
		});
}