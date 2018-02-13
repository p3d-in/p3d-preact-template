import { Component } from 'preact';
import log from 'loglevel';
import * as THREE from 'three';
import { p3dInit, P3dMesh } from 'p3d-three';
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
		this.gl =
			this.canvas.getContext('webgl') ||
			this.canvas.getContext('experimental-webgl');
		p3dInit(this.canvas, this.gl);

		let bounds = this.canvas.getBoundingClientRect();
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			45,
			bounds.width / bounds.height,
			0.1,
			100
		);
		this.camera.position.z = 3;

		// # renderer
		const renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			context: this.gl
		});
		renderer.setSize(bounds.width, bounds.height);
		renderer.setClearColor(0x000044);

		// # lights
		const light = new THREE.AmbientLight(0xffffff, 0.5);
		this.scene.add(light);
		let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		this.scene.add(directionalLight);

		// group
		const group = new THREE.Group();
		this.scene.add(group);

		// ## p3d mesh 1
		const p3dMesh1 = new P3dMesh();
		p3dMesh1.visible = false;
		p3dMesh1.autoCenter = false;
		group.add(p3dMesh1);
		p3dMesh1.load('9Gg6U').then(async mesh => {
			console.log('--- MESH1 MESH LOADED ----');
			await mesh.pendingTextures;
			console.log('--- MESH1 TEXS LOADED ----');
			mesh.visible = true;
		});

		// # animation
		const animate = () => {
			requestAnimationFrame(animate);
			//controls.update();

			group.rotation.x += 0.01;
			group.rotation.y += 0.01;

			renderer.render(this.scene, this.camera);
		};

		animate();
	}

	render() {
		return (
			<canvas class={style.this} ref={canvas => (this.canvas = canvas)} />
		);
	}
}
