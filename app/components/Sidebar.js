import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Sidebar({ location }) {
	return (
		<div className="sidebar module">
			<div className="module-inner">
				<div className="module-heading">
					<h3>controls</h3>
				</div>
			</div>
			<div className="module-content">
				<ul>
					<ControlOption location={location} name='depop'/>
					<ControlOption location={location} name='shopify'/>
				</ul>
			</div>
		</div>
	)
}

function ControlOption({ name, location }) {
	const active = location.pathname.includes(name);
	return (
		<li className={`control-option ${active && 'active'}`}>
			<Link to={`/${name}`}>{ name }</Link>
		</li>
	)
}

ControlOption.propTypes = {
	name: PropTypes.string.isRequired
}