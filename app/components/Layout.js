import React from 'react';
import Header from './Header';
import Body from './Body';
import Signin from './Signin';
import md5 from 'md5';

export default class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			token: '',
		};
	}

	componentDidMount() {
		fetch('https://webapi.depop.com/api/v1/shop/4835511/products?limit=1&offset_id=MTIxMTYwMTg0fDIwMTktMTEtMTJUMTc6MDA6MjUuODA4Wnw0NjA')
			.then((response) => response.json())
			.then((data) => console.log(JSON.stringify(data)))
	}

	handlePasswordSubmit = (password) => {
		this.setState({
			token: password
		});
	}

	render() {
		const auth = md5(this.state.token) === '1458d981ad13be0c33c913c0ac3e6e1f';
		return (
			<div className="layout">
				<Header />
				{ auth
					? <Body />
					: <Signin handlePasswordSubmit={this.handlePasswordSubmit} />
				}
			</div>
		)
	}
}