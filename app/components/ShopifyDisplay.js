import React from 'react';
import ProductTable from './ProductTable';
import { getShopifyProducts } from '../utils/api';

export default class ShopifyDisplay extends React.Component {
	componentDidMount() {
		if (this.props.clientToken) {
			this.loadProducts();
		}
	}

	loadProducts = () => {
		getShopifyProducts(this.props.clientToken)
			.then((data) => {
				if (data.status === 'success') {
					const products = data.products.map(product => {
						const { title, tags } = product;
						const images = product.images.map(image => image.src);
						const price = product.variants[0].price;
						const description = product.body_html.replace(/<\/?p> ?/g, '');
						return {
							title,
							description,
							tags,
							images,
							price,
						}
					});
					this.props.handleShopifyProductsUpdate(products);
				} else {
					console.log(data);
				}
			});
	}

	render() {
		const tableProducts = this.props.products.map(product => {
			const { title, description, images, price } = product;
			return {
				title, 
				description,
				images, 
				price, 
			}
		})
		const authorized = this.props.clientToken.length > 0;
		return (
			<div className='shopify-display module'>
				<div className='module-inner'>
					<div className='module-heading'>
						<h3>shopify</h3>
					</div>
						{ !authorized 
							? <AuthorizeMenu />
							: <Content loadProducts={this.loadProducts} tableProducts={tableProducts} />
						}
				</div>
			</div>
		)
	}
}

class AuthorizeMenu extends React.Component {
	state = {
		shopName: ''
	}

	handleShopNameChange = (e) => {
		this.setState({
			shopName: e.target.value
		})
	}

	render() {
		const { shopName } = this.state;
		return (
			<div className="authorize-menu">
				<div className="module-status">
					<input onChange={this.handleShopNameChange} placeholder="enter shop name" type="text"/>
					<a 
						className={`button ${shopName.length === 0 ? 'disabled' : ''}`}
						href={`https://anpoorte.herokuapp.com/shopify?shop=${shopName}.myshopify.com`}>
							authorize
					</a>
				</div>
			</div>
		)
	}
}

function Content({ loadProducts, tableProducts }) {
	return (
		<>
			<div className="module-status">
				<button onClick={loadProducts}>reload products</button>
			</div>
			<div className='module-content'>
				<ProductTable products={tableProducts} />
			</div>
		</>
	)
}