import React from 'react';
import ProductTable from './ProductTable';
import { 
	getShopifyProducts,
	getShopifyAuthStatus } from '../utils/api';

export default class ShopifyDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			authorized: false
		};

		this.loadProducts = this.loadProducts.bind(this);
	}

	componentDidMount() {
		getShopifyAuthStatus()
			.then((res) => {
				const { authorized } = res;
				this.setState({
					authorized
				});
				if (authorized) this.loadProducts();
			});
	}

	loadProducts() {
		getShopifyProducts()
			.then((data) => {
				const products = data.map(product => {
					const { title, tags } = product;
					const images = product.images.map(image => image.src);
					const price = product.variants[0].price;
					const size = product.variants[0].title;
					const blurb = product.body_html.replace(/<\/?p> ?/g, '');
					return {
						title,
						blurb,
						tags,
						images,
						price,
						size
					}
				});
				this.props.handleShopifyProductsUpdate(products);
			});
	}

	render() {
		const tableProducts = this.props.products.map(product => {
			const { title, blurb, images, price, size } = product;
			return {
				title, 
				blurb,
				images, 
				price, 
				size,
			}
		})
		return (
			<div className='shopify-display module'>
					<div className='module-inner'>
						<div className='module-heading'>
							<h3>shopify</h3>
						</div>
							{ !this.state.authorized 
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
						href={`https://7cbc7743.ngrok.io/shopify?shop=${shopName}.myshopify.com`}>
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