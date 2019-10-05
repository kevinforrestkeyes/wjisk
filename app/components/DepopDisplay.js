import React from 'react';
import PropTypes from 'prop-types';
import ProductTable from './ProductTable';
import ProductHandler from './ProductHandler';
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
	}

	componentDidMount() {
		if (this.props.products.length === 0) {
			this.updateProducts();
		}
		this.updateScrapeStatus();
		setInterval(() => {
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

	toggleViewMode() {
		const view = this.state.view === 'products' ? 'log' : 'products';
		this.setState({
			view
		});
	}

	toggleAllProductSelect(e) {
		const products = [...this.props.products].map(product => {
			product.selected = e.target.checked;
			return product;
		});
		this.props.handleDepopProductsUpdate(products);
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
									<button onClick={this.toggleViewMode}>
										{ view === 'products' 
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
							<ProductTable 
								products={this.props.products} 
								handleProductSelect={this.handleProductSelect}
								toggleAllProductSelect={this.toggleAllProductSelect}
							/>
						}
						{ view === 'log' && 
							<LogView logContent={logContent} />
						}
						{ view === 'edit' &&
							<ProductHandler products={this.props.products.filter(products => products.selected)} />
						}
					</div>
				</div>
			</div>
		)
	}
}

DepopDisplay.propTypes = {
	handleDepopProductsUpdate: PropTypes.func.isRequired,
	products: PropTypes.array.isRequired
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
								? (
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										width="18" 
										height="18" 
										viewBox="0 0 24 24" 
										fill="none" 
										stroke="#27ae60" 
										strokeWidth="2" 
										strokeLinecap="square" 
										strokeLinejoin="arcs"
									>
											<line x1="5" y1="12" x2="19" y2="12"></line>
									</svg>
								)
								: (
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										width="18" 
										height="18" 
										viewBox="0 0 24 24" 
										fill="none" 
										stroke="#27ae60" 
										strokeWidth="2" 
										strokeLinecap="square" 
										strokeLinejoin="arcs"
									>
										<line x1="12" y1="5" x2="12" y2="19"></line>
										<line x1="5" y1="12" x2="19" y2="12"></line>
									</svg>
								)
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