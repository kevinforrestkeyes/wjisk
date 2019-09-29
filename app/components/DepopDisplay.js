import React from 'react';
import PropTypes from 'prop-types';
import { getDepopProducts } from '../utils/api';

export default class DepopDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.updateProducts = this.updateProducts.bind(this);
	}

	componentDidMount() {
		if (this.props.products.length === 0) {
			this.updateProducts();
		}
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
		return (
			<div className="depop-display module">
				<div className="module-inner">
					<div className="module-heading">
						<h3>depop</h3>
					</div>
					<div className="module-content">
						{ this.props.products.length > 0
							? <ProductTable products={this.props.products} />
							: <p>loading...</p>
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