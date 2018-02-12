import webpack from 'webpack';
import path from 'path';
import asyncPlugin from 'preact-cli-plugin-fast-async';

export default function(config, env, helpers) {
	asyncPlugin(config);

	// skip babel for p3d-three and three
	let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
	rule.exclude = [/node_modules\/(p3d-three|three)/];

	// setup vendor chunk
	config.entry.vendor = ['p3d-three', 'three'];
	let { index } = helpers.getPluginsByName(config, 'CommonsChunkPlugin')[0];

	let chunks;
	if (env.ssr) {
		chunks = ['ssr-bundle', 'vendor'];
	}
	else {
		chunks = ['bundle', 'vendor'];
	}

	if (env.production) {
		config.resolve.alias.three = path.join(
			__dirname,
			'node_modules/three/build/three.min.js'
		);
	}

	config.plugins.splice(
		index,
		0,
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			filename: 'bundle.manifest.js',
			minChunks: Infinity
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'bundle.vendor.js',
			chunks,
			minChunks: 2
		})
	);
	config.output.filename = '[name].js';

	// exclude from uglify
	let plugins = helpers.getPluginsByName(config, 'UglifyJsPlugin');
	if (plugins.length > 0) {
		let plugin = plugins[0].plugin;
		plugin.options.exclude = /vendor\.js/;
		// fully remove uglify
		config.plugins.splice(plugins[0].index, 1);
	}
}
