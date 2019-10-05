import React from 'react';
import PropTypes from 'prop-types';

export default class ProductHandler extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		console.log(this.props.products);
		return (
			<div className="product-handler">
				<h1>product handler</h1>
			</div>
		)
	}
}

ProductHandler.propTypes = {
	products: PropTypes.array.isRequired
}