import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Layout from './components/Layout';

class App extends React.Component {
	render() {
		return (
			<div className="container">
				<Layout />
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
)