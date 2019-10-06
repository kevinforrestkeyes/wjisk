import React from 'react';
import PropTypes from 'prop-types';

export default class ProductHandler extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex: 0
		}

		this.updateActiveIndex = this.updateActiveIndex.bind(this);
	}

	updateActiveIndex(newIndex) {
		const totalLength = this.props.products.length;
		if (newIndex < 0) {
			newIndex = totalLength - 1;
		} else if (newIndex >= totalLength) {
			newIndex = 0;
		}
		this.setState({
			activeIndex: newIndex
		})
	}

	render() {
		const { products } = this.props;
		const { activeIndex } = this.state;
		const productCount = products.length;

		return (
			<div className="product-handler">
				<div className="handler-controls">
					<button onClick={() => this.updateActiveIndex(activeIndex - 1)} className="page-control">
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							width="16" 
							height="16" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="#27ae60" 
							strokeWidth="2" 
							strokeLinecap="round" 
							strokeLinejoin="round"
						>
								<path d="M19 12H6M12 5l-7 7 7 7"/>
						</svg>
					</button>
					<p>{`product ${activeIndex+1} of ${productCount}`}</p>
					<button onClick={() => this.updateActiveIndex(activeIndex + 1)} className="page-control">
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							width="16" 
							height="16" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="#27ae60" 
							strokeWidth="2" 
							strokeLinecap="round" 
							strokeLinejoin="round"
						>
								<path d="M5 12h13M12 5l7 7-7 7"/>
						</svg>
					</button>
				</div>
				<div className="handler-content">
					<ProductEditor product={products[activeIndex]} />
				</div>
			</div>
		)
	}
}

ProductHandler.propTypes = {
	products: PropTypes.array.isRequired
}

function ProductEditor({ product }) {
	const { blurb, images, price, size } = product;
	console.log(blurb);
	return (
		<div className="product-editor">
			<div className="images">
				{ images.map((image, index) => <img key={`image-${index}`} src={image} />) }
			</div>
			<div className="data">
				<div className="column">
					<label htmlFor="title">title</label>
					<input type="text" name="title"/>
					<label htmlFor="blurb">blurb</label>
					<textarea type="text" name="blurb" value={blurb}/>
				</div>
				<div className="column">
					<label htmlFor="price">price</label>
					<input type="text" name="price" value={price} />
					<label htmlFor="size">size</label>
					<input type="text" name="size" value={size}/>
					<label htmlFor="tags">tags</label>
					<input type="text" name="tags" />
				</div>
			</div>
		</div>
	)
}

ProductEditor.propTypes = {
	product: PropTypes.object.isRequired
}