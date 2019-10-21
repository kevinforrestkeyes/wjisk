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

	addProductsToShopify(products, shopifyClientToken) {
		products.forEach(product => addProductsToShopify(product, shopifyClientToken));
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
					<Route path='/' render={(props) => {
						return (
							<BodyContent 
								{...props}
								handleDepopProductsUpdate={this.handleDepopProductsUpdate} 
								depopProducts={this.state.depopProducts} 
								handleShopifyProductsUpdate={this.handleShopifyProductsUpdate} 
								shopifyProducts={this.state.shopifyProducts}
								addProductsToShopify={this.addProductsToShopify}
							/>
						)
					}}/>
					<Route path='/' component={Sidebar} />
				</div>
			</Router>
		);
	}
}

class BodyContent extends React.Component {
	state = {
		shopifyClientToken: ''
	}

	componentDidMount() {
		const { shopifyClientToken } = queryString.parse(this.props.location.search);
		if (shopifyClientToken) {
			this.setState({
				shopifyClientToken
			});
		}
	}

	render() {
		const { depopProducts, handleDepopProductsUpdate, handleShopifyProductsUpdate, shopifyProducts, addProductsToShopify } = this.props;

		return (
			<div className="body-content">
				<Route path='/' component={null} />
				<Route path='/depop' render={(props) => {
					return (
						<DepopDisplay {...props}
							handleDepopProductsUpdate={handleDepopProductsUpdate}
							products={depopProducts}
							addProductsToShopify={addProductsToShopify} 
							shopifyClientToken={this.state.shopifyClientToken}
						/>
					)
				}}/>
				<Route path='/shopify' render={(props) => {
					return (
						<ShopifyDisplay {...props}
							clientToken={this.state.shopifyClientToken}
							handleShopifyProductsUpdate={handleShopifyProductsUpdate}
							products={shopifyProducts}
						/>
					)
				}}/>
			</div>
		)
	}
}

BodyContent.propTypes = {
	depopProducts: PropTypes.array.isRequired,
	handleDepopProductsUpdate: PropTypes.func.isRequired,
	shopifyProducts: PropTypes.array.isRequired,
	handleShopifyProductsUpdate: PropTypes.func.isRequired,
	addProductsToShopify: PropTypes.func.isRequired
}