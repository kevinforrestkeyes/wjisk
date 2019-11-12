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