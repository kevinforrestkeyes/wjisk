import React from 'react';
import PropTypes from 'prop-types';
import { checkIfAllProductsSelected } from '../utils/helpers';

export default function ProductTable({ products, handleProductSelect, toggleAllProductSelect, filterValue }) {
	const tableHeadings = products.length > 0 ? Object.keys(products[0]) : [];
	const productsEmptyMessageText = ((products.length === 0) && (filterValue !== undefined) && (filterValue.length > 0))
		?	`no products found matching "${filterValue}"`
		: 'loading products...';

	return (
		<div className="product-table-container">
			{ products.length > 0
				? (
					<table className="product-table">
						<thead>
							<tr>
								{ tableHeadings.map((heading, index) => {
									return (
										<th key={index} className={heading}>
											{ heading !== 'selected' 
												? heading
												: <input 
														onChange={toggleAllProductSelect} 
														type="checkbox" 
														name="select" 
														id="all-select"
														checked={checkIfAllProductsSelected(products)}
													/>
											}
										</th>
									)
									})
								}
							</tr>
						</thead>
						<tbody>
							{ products.map((product, index) => {
								return (
									<TableRow 
										key={index} 
										product={product} 
										headings={tableHeadings} 
										handleProductSelect={() => handleProductSelect(index)} 
									/> 
								)})
							}
						</tbody>
					</table>
				)
				: <p>{productsEmptyMessageText}</p>
			}
		</div>
	)
}

ProductTable.propTypes = {
	products: PropTypes.array.isRequired,
	handleProductSelect: PropTypes.func,
	toggleAllProductSelect: PropTypes.func
}

function TableRow({ headings, product, handleProductSelect }) {
	return (
		<tr>
			{ headings.map((heading, index) => {
				return (
					<td key={index} className={heading}>
						{(() => {
							switch(heading) {
								case 'images':
									return product.images.map((imageUrl, index) => <img key={index} src={imageUrl} />);
								case 'selected':
									return (
										<input 
											onChange={handleProductSelect} 
											type="checkbox" 
											name="select" 
											id={`${index}-select`}
											checked={product.selected}
										/>
									);
								default:
									return <p>{ product[heading] }</p>;
							}
						})()}
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