import React from 'react';
import PropTypes from 'prop-types';
import DepopDisplay from './DepopDisplay';
import ShopifyDisplay from './ShopifyDisplay';
import Sidebar from './Sidebar';
import { addProductsToShopify } from '../utils/api';

export default class Body extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeModules: [
				'depop'
			],
			depopProducts: [],
			shopifyProducts: [],
		};

		this.handleModuleChange = this.handleModuleChange.bind(this);
		this.handleDepopProductsUpdate = this.handleDepopProductsUpdate.bind(this);
		this.handleShopifyProductsUpdate = this.handleShopifyProductsUpdate.bind(this);
		this.addProductsToShopify = this.addProductsToShopify.bind(this);
	}

	handleModuleChange(name) {
		let activeModules = [...this.state.activeModules];
		if (activeModules.includes(name)) {
			activeModules.splice(activeModules.indexOf(name),1);
		} else {
			activeModules = [name];
		}
		this.setState({
			activeModules
		})
	}

	addProductsToShopify(products) {
		addProductsToShopify(products[0]);
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
			<div className="body">
				<BodyContent 
					activeModules={this.state.activeModules} 
					handleDepopProductsUpdate={this.handleDepopProductsUpdate} 
					depopProducts={this.state.depopProducts} 
					handleShopifyProductsUpdate={this.handleShopifyProductsUpdate} 
					shopifyProducts={this.state.shopifyProducts}
					addProductsToShopify={this.addProductsToShopify}
				/>
				<Sidebar 
					activeModules={this.state.activeModules} 
					handleModuleChange={this.handleModuleChange} 
				/>
			</div>
		);
	}
}

function BodyContent({ activeModules, depopProducts, handleDepopProductsUpdate, handleShopifyProductsUpdate, shopifyProducts, addProductsToShopify }) {
	return (
		<div className="body-content">
			{ activeModules.includes('depop') && 
				<DepopDisplay 
					handleDepopProductsUpdate={handleDepopProductsUpdate} 
					products={depopProducts} 
					addProductsToShopify={addProductsToShopify}
				/>
			}
			{ activeModules.includes('shopify') && 
				<ShopifyDisplay 
					handleShopifyProductsUpdate={handleShopifyProductsUpdate}
					products={shopifyProducts}
				/>
			}
		</div>
	)
}

BodyContent.propTypes = {
	activeModules: PropTypes.array.isRequired,
	depopProducts: PropTypes.array.isRequired,
	handleDepopProductsUpdate: PropTypes.func.isRequired,
	shopifyProducts: PropTypes.array.isRequired,
	handleShopifyProductsUpdate: PropTypes.func.isRequired,
	addProductsToShopify: PropTypes.func.isRequired
}