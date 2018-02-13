import './style';
import { Component } from 'preact';

import P3d from './components/p3d';

export default class App extends Component {
	render() {
		return (
			<div>
				<h1>Hello, World!</h1>
				<div class="container">
					<div class="p3d">
						<P3d />
					</div>
				</div>
			</div>
		);
	}
}
