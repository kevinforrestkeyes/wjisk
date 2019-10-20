import React from 'react';
import PropTypes from 'prop-types';
import ProductTable from './ProductTable';
import ProductHandler from './ProductHandler';
import { Plus, Minus } from './Icons';
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
			lastScrape: '',
			scrapeStatus: '',
			logContent: []
		}
		this.toggleViewMode = this.toggleViewMode.bind(this);
		this.updateProducts = this.updateProducts.bind(this);
		this.updateScrapeStatus = this.updateScrapeStatus.bind(this);
		this.startNewDepopScrape = this.startNewDepopScrape.bind(this);
		this.handleProductSelect = this.handleProductSelect.bind(this);
		this.toggleAllProductSelect = this.toggleAllProductSelect.bind(this);
		this.handleAddProductsToShopify = this.handleAddProductsToShopify.bind(this);
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

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	updateScrapeStatus() {
		getDepopScrapeInfo()
			.then((data) => {
				const scrapeStatus = data.status.updateInProgress ? 'in-progress' : 'completed';
				let lastScrape = 'N/A';
				if (data.log.length > 0) {
					const lastScrapeIndex = Object.keys(data.log)
					.sort((a, b) => {
						return new Date(data.log[b].runStartTime) - new Date(data.log[a].runStartTime);
					})
					.find(index => {
						const log = data.log[index];
						if ((log.request === 'update-depop-products') && (log.runEndTime !== null)) {
							return true;
						}
					});
					lastScrape = lastScrapeIndex !== undefined ? data.log[lastScrapeIndex].runEndTime : 'N/A';
				}
				this.setState({
					scrapeStatus,
					lastScrape,
					logContent: data.log
				})
			});
	}

	startNewDepopScrape() {
		updateDepopProducts()
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
		this.props.addProductsToShopify(products);
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
		getDepopProducts()
			.then((data) => {
				const products = data.map(product => {
					const { blurb, images, size, price } = product;
					return {
						selected: false,
						blurb,
						size,
						images,
						price
					}
				});
				this.props.handleDepopProductsUpdate(products);
			})
	}

	render() {
		const { scrapeStatus, lastScrape, view, logContent } = this.state;
		const { products } = this.props;
		const scrapeStatusLoaded = ((scrapeStatus.length > 0) && (lastScrape.length > 0));
		return (
			<div className="depop-display module">
				<div className="module-inner">
					<div className="module-heading">
						<h3>depop</h3>
					</div>
					<div className="module-status">
						{ scrapeStatusLoaded
						? <>
								<p>scrape status: <span className={scrapeStatus}>{scrapeStatus}</span></p>
								<p>last scrape: {lastScrape}</p>
								<div className="button-container">
									<button 
										onClick={() => this.toggleViewMode(view === 'log' ? 'products' : 'log')}
									>
										{ view !== 'log' 
											? 'show'
											: 'hide'
										} log
									</button>
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
								/>
								<ProductTable 
									products={products} 
									handleProductSelect={this.handleProductSelect}
									toggleAllProductSelect={this.toggleAllProductSelect}
								/>
							</>
						}
						{ view === 'log' && 
							<LogView logContent={logContent} />
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

function TableControls({ view, toggleViewMode, updateProducts, enableEdit }) {
	return (
		<div className="table-controls">
			{ view === 'products' && 
				<>
					<button disabled={!enableEdit} onClick={() => toggleViewMode('edit')}>add selected products to shopify</button>
					<button onClick={updateProducts}>reload products</button>
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
	enableEdit: PropTypes.bool
}

function LogView({ logContent }) {
	const logSorted = logContent.sort((a, b) => {
		return new Date(b.runStartTime) - new Date(a.runStartTime);
	})
	return (
		<table className="log-table">
			<thead>
				<tr>
					<th className="id">id</th>
					<th className="start">run start time</th>
					<th className="end">run end time</th>
					<th className="expand">expand</th>
				</tr>
			</thead>
			<tbody>
				{ logSorted.map(logEntry => <LogEntry key={logEntry.id} logData={logEntry} />) }
			</tbody>
		</table>
	)
}

LogView.propTypes = {
	logContent: PropTypes.array.isRequired
}

class LogEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			expanded: false
		}

		this.toggleExpand = this.toggleExpand.bind(this);
	}

	toggleExpand() {
		const expanded = !this.state.expanded;
		this.setState({
			expanded
		})
	}

	render() {
		const { logData } = this.props;
		return (
			<>
				<tr>
					<td className="id">{ logData.id }</td>
					<td className="start">{ logData.runStartTime }</td>
					<td className="end">{ logData.runEndTime !== null ? logData.runEndTime : 'N/A' }</td>
					<td className="expand">
						<button onClick={this.toggleExpand} className="expand-collapse">
							{ this.state.expanded 
								? <Minus />
								: <Plus />
							}
						</button>
					</td>
				</tr>
				{ this.state.expanded && 
					<tr className="log-details">
						<td>
							<table>
								<thead>
									<tr>
										<th className="timestamp">entry time</th>
										<th className="message">entry message</th>
									</tr>
								</thead>
								<tbody>
									{ logData.logContents.map((subEntry, index) => {
										return (
											<tr key={index}>
												<td className="timestamp">{ subEntry.timestamp.split(', ')[1] }</td>
												<td className="message">{ subEntry.entry }</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</td>
					</tr>
				}
			</>
		)
	}
}

LogEntry.propTypes = {
	logData: PropTypes.object.isRequired
}