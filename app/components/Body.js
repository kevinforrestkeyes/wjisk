import React from 'react';
import PropTypes from 'prop-types';
import DepopDisplay from './DepopDisplay';
import ShopifyDisplay from './ShopifyDisplay';
import Sidebar from './Sidebar';

export default class Body extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeModules: [
				'shopify'
			],
			depopProducts: [],
			shopifyProducts: [],
		};

		this.handleModuleChange = this.handleModuleChange.bind(this);
		this.handleDepopProductsUpdate = this.handleDepopProductsUpdate.bind(this);
		this.handleShopifyProductsUpdate = this.handleShopifyProductsUpdate.bind(this);
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
				/>
				<Sidebar 
					activeModules={this.state.activeModules} 
					handleModuleChange={this.handleModuleChange} 
				/>
			</div>
		);
	}
}

function BodyContent({ activeModules, depopProducts, handleDepopProductsUpdate, handleShopifyProductsUpdate, shopifyProducts }) {
	return (
		<div className="body-content">
			{ activeModules.includes('depop') && 
				<DepopDisplay 
					handleDepopProductsUpdate={handleDepopProductsUpdate} 
					products={depopProducts} 
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
	handleShopifyProductsUpdate: PropTypes.func.isRequired
}