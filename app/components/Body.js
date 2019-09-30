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
			depopProducts: []
		};

		this.handleModuleChange = this.handleModuleChange.bind(this);
		this.handleDepopProductsUpdate = this.handleDepopProductsUpdate.bind(this);
	}

	handleModuleChange(name) {
		const activeModules = this.state.activeModules;
		if (activeModules.includes(name)) {
			activeModules.splice(activeModules.indexOf(name),1);
		} else {
			activeModules.push(name);
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

	render() {
		return (
			<div className="body">
				<BodyContent 
					activeModules={this.state.activeModules} 
					handleDepopProductsUpdate={this.handleDepopProductsUpdate} 
					depopProducts={this.state.depopProducts} 
				/>
				<Sidebar 
					activeModules={this.state.activeModules} 
					handleModuleChange={this.handleModuleChange} 
				/>
			</div>
		);
	}
}

function BodyContent({ activeModules, depopProducts, handleDepopProductsUpdate }) {
	return (
		<div className="body-content">
			{ activeModules.includes('depop') && 
				<DepopDisplay 
					handleDepopProductsUpdate={handleDepopProductsUpdate} 
					products={depopProducts} 
				/>
			}
			{ activeModules.includes('shopify') && 
				<ShopifyDisplay />
			}
		</div>
	)
}

BodyContent.propTypes = {
	activeModules: PropTypes.array.isRequired,
	depopProducts: PropTypes.array.isRequired,
	handleDepopProductsUpdate: PropTypes.func.isRequired
}