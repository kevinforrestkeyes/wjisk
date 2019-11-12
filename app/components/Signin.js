import React from 'react';

export default class Signin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			password: ''
		};
	}

	handleChange = (event) => {
		event.preventDefault();
		this.setState({
			password: event.target.value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.handlePasswordSubmit(this.state.password);
	}

	render() {
		return (
			<div className="sign-in module">
				<form className="module-inner" onSubmit={this.handleSubmit}>
					<div className="module-heading">
						<h3>password pls</h3>
					</div>
					<div className="module-content">
						<label htmlFor="password">right here bich: </label>
						<input type="password" name="password" value={this.state.password} onChange={this.handleChange} autoComplete="current-password"/>
						<input type="submit" value="gib me"/>
					</div>
				</form>
			</div>
		)
	}
}