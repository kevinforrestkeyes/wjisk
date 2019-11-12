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
			<div className="sign-in">
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="password">why don't ya spill yer beans</label>
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange} autoComplete="current-password"/>
					<input type="submit" value="submit it"/>
				</form>
			</div>
		)
	}
}