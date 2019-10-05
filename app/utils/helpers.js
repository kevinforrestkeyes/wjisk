export function checkIfAllProductsSelected(products) {
	const allSelected = products.find(product => !product.selected) === undefined;
	return allSelected;
}

export function checkIfAnyProductsSelected(products) {
	const anySelected = products.find(product => product.selected) !== undefined;
	return anySelected;
}