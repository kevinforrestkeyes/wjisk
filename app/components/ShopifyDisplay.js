import React from 'react';
import { getShopifyProducts, testShopifyEndpoint } from '../utils/api';

export default function ShopifyDisplay() {
	return (
		<div className='shopify-display module'>
				<div className='module-inner'>
					<div className='module-heading'>
						<h3>shopify</h3>
					</div>
					<div className='module-content'>
						<button onClick={testShopifyEndpoint}>TEST</button>
						<button onClick={getShopifyProducts}>REAL</button>
						<a className='button' href='https://a45df053.ngrok.io/shopify?shop=poorbaby-fashion.myshopify.com'>AUTHORIZE</a>
					</div>
				</div>
			</div>
	)
}