import React from 'react';
import DepopDisplay from './DepopDisplay';
import Sidebar from './Sidebar';

export default class Body extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeModules: [
				'depop'
			]
		};

		this.handleModuleChange = this.handleModuleChange.bind(this);
	}

	handleModuleChange(name) {
		const activeModules = this.state.activeModules;
		if (activeModules.includes(name)) {
			activeModules.splice(activeModules.indexOf(name),1);
		} else {
			activeModules.push(name);
		}
		this.setState({
			activeModules
		})
	}

	render() {
		return (
			<div className="body">
				<BodyContent activeModules={this.state.activeModules} />
				<Sidebar activeModules={this.state.activeModules} handleModuleChange={this.handleModuleChange} />
			</div>
		);
	}
}

function BodyContent({ activeModules }) {
	return (
		<div className="body-content">
			{ activeModules.includes('depop') && 
				<DepopDisplay />
			}		
		</div>
	)
}