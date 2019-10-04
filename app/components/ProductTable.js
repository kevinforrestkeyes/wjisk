import React from 'react';
import PropTypes from 'prop-types';

export default function ProductTable({ products }) {
	const tableHeadings = products.length > 0 ? Object.keys(products[0]) : [];
	return (
		<div className="product-table-container">
			{ products.length > 0
				? (
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
				: <p>loading products...</p>
			}
		</div>
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