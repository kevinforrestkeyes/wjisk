import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import DepopDisplay from './DepopDisplay';
import ShopifyDisplay from './ShopifyDisplay';
import Sidebar from './Sidebar';
import { addProductsToShopify } from '../utils/api';

export default class Body extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			depopProducts: [],
			shopifyProducts: [],
		};

		this.handleDepopProductsUpdate = this.handleDepopProductsUpdate.bind(this);
		this.handleShopifyProductsUpdate = this.handleShopifyProductsUpdate.bind(this);
		this.addProductsToShopify = this.addProductsToShopify.bind(this);
	}

	componentDidMount() {
		console.log(queryString.parse(window.location.href));
		// console.log(shopifyClientToken);
	}

	addProductsToShopify(products) {
		products.forEach(product => addProductsToShopify(product));
	}

	handleDepopProductsUpdate(products) {
		this.setState({
			depopProducts: products
		});
	}

	handleShopifyProductsUpdate(products) {
		this.setState({
			shopifyProducts: products
		});
	}

	render() {
		return (
			<Router>
				<div className="body">
					<BodyContent 
						handleDepopProductsUpdate={this.handleDepopProductsUpdate} 
						depopProducts={this.state.depopProducts} 
						handleShopifyProductsUpdate={this.handleShopifyProductsUpdate} 
						shopifyProducts={this.state.shopifyProducts}
						addProductsToShopify={this.addProductsToShopify}
					/>
					<Route path='/' component={Sidebar} />
				</div>
			</Router>
		);
	}
}

function BodyContent({ depopProducts, handleDepopProductsUpdate, handleShopifyProductsUpdate, shopifyProducts, addProductsToShopify }) {
	const depopProps = {
		handleDepopProductsUpdate,
		products: depopProducts,
		addProductsToShopify
	};
	const shopifyProps = {
		handleShopifyProductsUpdate,
		products: shopifyProducts
	};
	return (
		<div className="body-content">
			<Route path='/' component={null} />
			<Route path='/depop' render={(props) => {
				return (
					<DepopDisplay {...props}
						handleDepopProductsUpdate={handleDepopProductsUpdate}
						products={depopProducts}
						addProductsToShopify={addProductsToShopify} 
					/>
				)
			}}/>
			<Route path='/shopify' render={(props) => {
				return (
					<ShopifyDisplay {...props}
						handleShopifyProductsUpdate={handleShopifyProductsUpdate}
						products={shopifyProducts}
					/>
				)
			}}/>
		</div>
	)
}

BodyContent.propTypes = {
	depopProducts: PropTypes.array.isRequired,
	handleDepopProductsUpdate: PropTypes.func.isRequired,
	shopifyProducts: PropTypes.array.isRequired,
	handleShopifyProductsUpdate: PropTypes.func.isRequired,
	addProductsToShopify: PropTypes.func.isRequired
}