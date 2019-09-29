import React from 'react';
import PropTypes from 'prop-types';
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
					if (scrapeStatus !== this.state.scrapeStatus) this.updateScrapeStatus();
				});
		}, 10000);
	}

	updateScrapeStatus() {
		getDepopScrapeInfo()
			.then((data) => {
				const scrapeStatus = data.status.updateInProgress ? 'in-progress' : 'completed';
				const lastScrapeIndex = Object.keys(data.log).find(index => {
					const log = data.log[index];
					if ((log.request === 'update-depop-products') && (log.runEndTime !== null)) {
						return true;
					}
				});
				const lastScrape = data.log[lastScrapeIndex].runEndTime;
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

function ProductTable({ products }) {
	const tableHeadings = Object.keys(products[0]);
	return (
		<table className="product-table">
			<thead>
				<tr>
					{ tableHeadings.map((heading, index) => <th key={index} className={heading}>{heading}</th>) }
				</tr>
			</thead>
			<tbody>
				{ products.map((product, index) => <TableRow key={index} product={product} headings={tableHeadings} /> ) }
			</tbody>
		</table>
	)
}

ProductTable.propTypes = {
	products: PropTypes.array.isRequired
}

function TableRow({ headings, product }) {
	return (
		<tr>
			{ headings.map((heading, index) => {
						return (
							<td key={index} className={heading}>
								{ heading === 'images' 
									? product.images.map((imageUrl, index) => <img key={index} src={imageUrl} />)
									: <p>{ product[heading] }</p>
								}
							</td>
						)
				})
			}
		</tr>
	)
}

TableRow.propTypes = {
	product: PropTypes.object.isRequired,
	headings: PropTypes.array.isRequired
}