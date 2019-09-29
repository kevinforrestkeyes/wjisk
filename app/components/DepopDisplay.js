import React from 'react';
import { getDepopProducts } from '../utils/api';

export default class DepopDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			products: []
		}
	}

	componentDidMount() {
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
				this.setState({
					products
				})
			})
	}

	render() {
		console.log(this.state.products);
		return (
			<div className="depop-display module">
				<div className="module-inner">
					<div className="module-heading">
						<h3>depop</h3>
					</div>
					<div className="module-content">
						{ this.state.products.length > 0 && 
							<ProductTable products={this.state.products} />
						}
					</div>
				</div>
			</div>
		)
	}
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