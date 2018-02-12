import { Component } from 'preact';
import log from 'loglevel';
import { p3dInit } from 'p3d-three';
import pkg from '../../package.json';
import style from './style';

// TODO: move somewhere else
log.setDefaultLevel('info');
window.log = log;

export default class P3d extends Component {
	constructor() {
		super();
		log.info(`${pkg.name} ver. ${pkg.version}`);
	}

	async componentDidMount() {
		// Initialize canvas, gl, p3d
		this.canvas = this.canvas;
		this.gl =
			this.canvas.getContext('webgl') ||
			this.canvas.getContext('experimental-webgl');
		p3dInit(this.canvas, this.gl);
	}

	render() {
		return (
			<div class={style.p3d}>
				<canvas ref={canvas => (this.canvas = canvas)} />
			</div>
		);
	}
}
