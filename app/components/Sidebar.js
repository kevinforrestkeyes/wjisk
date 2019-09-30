import React from 'react';
import PropTypes from 'prop-types';

export default function Sidebar({ activeModules, handleModuleChange }) {
	return (
		<div className="sidebar module">
			<div className="module-inner">
				<div className="module-heading">
					<h3>controls</h3>
				</div>
			</div>
			<div className="module-content">
				<ul>
					<ControlOption activeModules={activeModules} name='depop' handleModuleChange={handleModuleChange}/>
					<ControlOption activeModules={activeModules} name='shopify' handleModuleChange={handleModuleChange}/>
				</ul>
			</div>
		</div>
	)
}

Sidebar.propTypes = {
	activeModules: PropTypes.array.isRequired,
	handleModuleChange: PropTypes.func.isRequired
}

function ControlOption({ activeModules, handleModuleChange, name }) {
	return (
		<li onClick={() => handleModuleChange(name)} className={`control-option ${activeModules.includes(name) && 'active'}`}>
			{ name }
		</li>
	)
}


ControlOption.propTypes = {
	activeModules: PropTypes.array.isRequired,
	handleModuleChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired
}