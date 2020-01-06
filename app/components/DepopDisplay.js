import React from 'react';
import PropTypes from 'prop-types';
import ProductTable from './ProductTable';
import ProductHandler from './ProductHandler';
import { checkIfAnyProductsSelected } from '../utils/helpers';
import { 
	getDepopProducts, 
	getDepopScrapeInfo, 
	getDepopScrapeStatus,
	updateDepopProducts } from '../utils/api';

export default class DepopDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			view: 'products',
			scrapeStatus: '',
			initialLoad: false,
			productFilter: '',
		}
		this.toggleViewMode = this.toggleViewMode.bind(this);
		this.updateProducts = this.updateProducts.bind(this);
		this.updateScrapeStatus = this.updateScrapeStatus.bind(this);
		this.startNewDepopScrape = this.startNewDepopScrape.bind(this);
		this.handleProductSelect = this.handleProductSelect.bind(this);
		this.toggleAllProductSelect = this.toggleAllProductSelect.bind(this);
		this.handleAddProductsToShopify = this.handleAddProductsToShopify.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
	}

	componentDidMount() {
		if (this.props.products.length === 0) {
			this.updateProducts();
		}
		this.updateScrapeStatus();
		this.timerID = setInterval(() => {
			getDepopScrapeStatus()
				.then((status) => {
					const scrapeStatus = status.updateInProgress ? 'in-progress' : 'completed';
					if (scrapeStatus !== this.state.scrapeStatus) {
						this.updateScrapeStatus();
						this.updateProducts();
					}
				});
		}, 10000);
	}

	componentDidUpdate() {
		if (!this.state.initialLoad && (this.props.depopStoreId.length > 0)) {
			this.updateProducts();
			this.setState({
				initialLoad: true
			});
		}
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	updateScrapeStatus() {
		getDepopScrapeInfo()
			.then((data) => {
				const scrapeStatus = data.status[0].updateInProgress ? 'in-progress' : 'completed';
				this.setState({
					scrapeStatus,
				})
			});
	}

	startNewDepopScrape() {
		updateDepopProducts(this.props.depopStoreId)
			.then(() => this.updateScrapeStatus());
	}

	toggleViewMode(newView) {
		this.setState({
			view: newView
		});
	}

	toggleAllProductSelect(e) {
		const products = [...this.props.products].map(product => {
			product.selected = e.target.checked;
			return product;
		});
		this.props.handleDepopProductsUpdate(products);
	}

	handleAddProductsToShopify(products) {
		this.props.addProductsToShopify(products, this.props.shopifyClientToken);
		alert(`added ${products.length} products to shopify`);
		this.setState({
			view: 'products'
		});
	}

	handleProductSelect(index) {
		const products = [...this.props.products];
		products[index].selected = !products[index].selected;
		this.props.handleDepopProductsUpdate(products);
	}

	updateProducts() {
		getDepopProducts(this.props.depopStoreId)
			.then((data) => {
				const products = data.map(product => {
					const { description, images, price } = product;
					return {
						selected: false,
						description,
						images,
						price
					}
				});
				this.props.handleDepopProductsUpdate(products);
			})
	}

	updateFilter(e) {
		this.setState({
			productFilter: e.target.value
		});
	}

	render() {
		const { scrapeStatus, view, productFilter } = this.state;
		const { products, shopifyClientToken, depopStoreId, handleStoreSubmit } = this.props;
		const filteredProducts = products.filter(product => product.description.includes(productFilter));
		const scrapeStatusLoaded = scrapeStatus.length > 0;
		const shopifyAuthorized = shopifyClientToken.length > 0;
		return (
			<div className="depop-display module">
				<div className="module-inner">
					<div className="module-heading">
						<h3>depop</h3>
					</div>
					{ depopStoreId.length > 0 
						? (
							<>
								<div className="module-status">
									{ scrapeStatusLoaded
									? <>
											<p>scrape status: <span className={scrapeStatus}>{scrapeStatus}</span></p>
											<div className="button-container">
												<button 
													disabled={scrapeStatus === 'in-progress'} 
													onClick={this.startNewDepopScrape}>
													{scrapeStatus === 'in-progress'
														? 'scrape in progress'
														: 'new scrape'
													}
												</button>
											</div>
										</>
									: <p>loading status...</p>
									}
								</div>
								<div className="module-content">
									{ view === 'products' && 
										<>
											<TableControls 
												view={view} 
												updateProducts={this.updateProducts} 
												toggleViewMode={this.toggleViewMode}
												enableEdit={checkIfAnyProductsSelected(products)}
												shopifyAuthorized={shopifyAuthorized}
												updateFilter={this.updateFilter}
												filterValue={productFilter}
											/>
											<ProductTable 
												products={filteredProducts} 
												filterValue={productFilter}
												handleProductSelect={this.handleProductSelect}
												toggleAllProductSelect={this.toggleAllProductSelect}
											/>
										</>
									}
									{ view === 'edit' && products.length > 0 &&
										<>
											<TableControls 
												view={view} 
												toggleViewMode={this.toggleViewMode}
											/>
											<ProductHandler 
												products={products.filter(products => products.selected)} 
												addProductsToShopify={this.handleAddProductsToShopify}
											/>
										</>
									}
								</div>
							</>
						)
						: <DepopStoreInput handleStoreSubmit={handleStoreSubmit} />
					}
				</div>
			</div>
		)
	}
}

DepopDisplay.propTypes = {
	handleDepopProductsUpdate: PropTypes.func.isRequired,
	addProductsToShopify: PropTypes.func.isRequired,
	products: PropTypes.array.isRequired
}

function TableControls({ view, toggleViewMode, updateProducts, enableEdit, shopifyAuthorized, updateFilter, filterValue }) {
	return (
		<div className="table-controls">
			{ view === 'products' && 
				<>
					<button disabled={!(shopifyAuthorized && enableEdit)} onClick={() => toggleViewMode('edit')}>
						{ shopifyAuthorized ? 'add selected products to shopify' : 'must authorize shopify first'}
					</button>
					<button onClick={updateProducts}>reload products</button>
					<input name="filter" type="text" placeholder="filter" onChange={updateFilter} value={filterValue}/>
				</>
			}
			{ view === 'edit' && 
				<button onClick={() => toggleViewMode('products')}>cancel</button>
			}
		</div>
	)
}

TableControls.propTypes = {
	view: PropTypes.string.isRequired,
	toggleViewMode: PropTypes.func.isRequired,
	updateDepopProducts: PropTypes.func,
	enableEdit: PropTypes.bool,
	shopifyAuthorized: PropTypes.bool,
	updateFilter: PropTypes.func,
	filterValue: PropTypes.string
}

class DepopStoreInput extends React.Component {
	state = {
		storeName: ''
	};

	updateStoreName = (e) => {
		this.setState({
			storeName: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.handleStoreSubmit(this.state.storeName);
	}

	render() {
		const { storeName } = this.state;
		return (
			<div className="depop-store-input">
				<form onSubmit={this.handleSubmit}>
					<input type="text" onChange={this.updateStoreName} placeholder="enter store name" value={storeName} />
					<input className="button" type="submit" value="submit"/>
				</form>
			</div>
		)
	}
}