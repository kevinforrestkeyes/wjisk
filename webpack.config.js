const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './app/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
			{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
			{ test: /\.(jpe?g|png|gif|ico)$/i, loader: 'file-loader?name=[name].[ext]'},
			{
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
			},
		]
	},
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.html',
			favicon: 'favicon.ico'
		}),
		new CopyPlugin([
			{ from : '_redirects' }
		])
	],
	devServer: {
		historyApiFallback: true,
	}
}