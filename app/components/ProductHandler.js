import React from 'react';
import PropTypes from 'prop-types';
import ProductTable from './ProductTable';
import { ArrowPrevious, ArrowNext } from './Icons';

export default class ProductHandler extends React.Component {
	constructor(props) {
		super(props);

		const productsForShopify = [...this.props.products];

		this.state = {
			activeIndex: 0,
			productsForShopify,
			mode: 'edit'
		}

		this.updateActiveIndex = this.updateActiveIndex.bind(this);
		this.updateProductForShopify = this.updateProductForShopify.bind(this);
		this.toggleMode = this.toggleMode.bind(this);
	}

	updateActiveIndex(newIndex) {
		const totalLength = this.state.productsForShopify.length;
		if (newIndex < 0) {
			newIndex = totalLength - 1;
		} else if (newIndex >= totalLength) {
			newIndex = 0;
		}
		this.setState({
			activeIndex: newIndex
		})
	}

	updateProductForShopify(e) {
		const { activeIndex, productsForShopify } = this.state;
		const fieldName = e.target.name;
		const fieldValue = e.target.value;
		const products = [...productsForShopify];
		products[activeIndex][fieldName] = fieldValue;
		this.setState({
			productsForShopify: products,
		});
	}

	toggleMode() {
		const mode = this.state.mode === 'edit' ? 'confirm' : 'edit';
		const allProductsHaveTitles = this.state.productsForShopify.find(product => (product.title !== undefined && product.title.length > 0)) === undefined;
		if (mode === 'confirm' && allProductsHaveTitles) {
			alert('all products must have titles');
		} else {
			this.setState({
				mode
			})
		}
	}

	render() {
		const { activeIndex, productsForShopify, mode } = this.state;
		const { addProductsToShopify } = this.props;
		const productCount = productsForShopify.length;
		
		return (
			<div className="product-handler">
				<div className="handler-controls">
					{ mode === 'edit' && 
						<>
							<button onClick={this.toggleMode}>submit all to shopify</button>
							<button onClick={() => this.updateActiveIndex(activeIndex - 1)} className="page-control">
								<ArrowPrevious />
							</button>
							<p>{`product ${activeIndex+1} of ${productCount}`}</p>
							<button onClick={() => this.updateActiveIndex(activeIndex + 1)} className="page-control">
								<ArrowNext />
							</button>
						</>
					}
					{ mode === 'confirm' && 
						<>
							<button onClick={this.toggleMode}>back to edit</button>
							<button onClick={() => addProductsToShopify(productsForShopify)}>{`add all ${productsForShopify.length} products to shopify`}</button>
						</>
					}
				</div>
				<div className="handler-content">
					{ mode === 'edit' && 
						<ProductEditor 
							product={productsForShopify[activeIndex]} 
							updateProductForShopify={this.updateProductForShopify} 
						/>
					}
					{ mode === 'confirm' && 
						<ProductConfirmation products={productsForShopify} />
					}
				</div>
			</div>
		)
	}
}

ProductHandler.propTypes = {
	products: PropTypes.array.isRequired,
	addProductsToShopify: PropTypes.func.isRequired
}

function ProductEditor({ product, updateProductForShopify }) {
	const { description, images, price } = product;
	const title = product.title !== undefined ? product.title : '';
	const tags = product.tags !== undefined ? product.tags : '';
	return (
		<div className="product-editor">
			<div className="images">
				{ images.map((image, index) => <img key={`image-${index}`} src={image} />) }
			</div>
			<form className="data">
				<div className="column">
					<label htmlFor="title">title</label>
					<input 
						type="text" 
						name="title" 
						onChange={updateProductForShopify} 
						value={title} 
						placeholder="title"
					/>
					<label htmlFor="description">description</label>
					<textarea 
						type="text" 
						name="description" 
						onChange={updateProductForShopify} 
						value={description} 
						placeholder="description"
					/>
				</div>
				<div className="column">
					<label htmlFor="price">price</label>
					<input 
						type="text" 
						name="price" 
						onChange={updateProductForShopify} 
						value={price !== null ? price : ''} 
						placeholder="price"
					/>
					<label htmlFor="tags">tags</label>
					<input 
						type="text" 
						name="tags" 
						onChange={updateProductForShopify} 
						value={tags} 
						placeholder="tags, comma-separated"
					/>
				</div>
			</form>
		</div>
	)
}

ProductEditor.propTypes = {
	product: PropTypes.object.isRequired,
	updateProductForShopify: PropTypes.func.isRequired
}

function ProductConfirmation({ products }) {
	const productMini = products.map(product => {
		const { images, title, price} = product;
		return {
			images,
			title,
			price,
		}
	})
	return (
		<div className="product-confirmation">
			<ProductTable products={productMini} />
		</div>
	)
}

ProductConfirmation.propTypes = {
	products: PropTypes.array.isRequired
}