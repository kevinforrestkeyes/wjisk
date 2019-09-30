import React from 'react';
import PropTypes from 'prop-types';
import ProductTable from './ProductTable';
import { 
	getDepopProducts, 
	getDepopScrapeInfo, 
	getDepopScrapeStatus,
	updateDepopProducts } from '../utils/api';

export default class DepopDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lastScrape: '',
			scrapeStatus: '',
		}

		this.updateProducts = this.updateProducts.bind(this);
		this.updateScrapeStatus = this.updateScrapeStatus.bind(this);
		this.startNewDepopScrape = this.startNewDepopScrape.bind(this);
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
					const lastScrapeIndex = Object.keys(data.log).find(index => {
						const log = data.log[index];
						if ((log.request === 'update-depop-products') && (log.runEndTime !== null)) {
							return true;
						}
					});
					lastScrape = lastScrapeIndex !== undefined ? data.log[lastScrapeIndex].runEndTime : 'N/A';
				}
				this.setState({
					scrapeStatus,
					lastScrape
				})
			});
	}

	startNewDepopScrape() {
		updateDepopProducts()
			.then(() => this.updateScrapeStatus());
	}

	updateProducts() {
		getDepopProducts()
			.then((data) => {
				const products = data.map(product => {
					const { blurb, images, size, price } = product;
					return {
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
		const { scrapeStatus, lastScrape } = this.state;
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
								<button 
									disabled={scrapeStatus === 'in-progress'} 
									onClick={this.startNewDepopScrape}>
									{scrapeStatus === 'in-progress'
										? 'scrape in progress'
										: 'new scrape'
									}
								</button>
							</>
						: <p>loading status...</p>
						}
					</div>
					<div className="module-content">
						{ this.props.products.length > 0
							? <ProductTable products={this.props.products} />
							: <p>loading products...</p>
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