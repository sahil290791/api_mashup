var webpack = require('webpack');
module.exports = {
	entry: "./js/app.js",
	output: {
		filename: "./js/bundle.js"
	},
	watch: true,
	module: {
	 	preLoaders: [
	      {
	        test: /\.js$/,
	        exclude: /node_modules/,
	        loader: 'jshint-loader'
	      }
	   ],
	   loaders: [
	     {
	       test: /\.(js|jsx)$/,
	       exclude: /node_modules/,
	       loader: 'babel-loader',
	       query: {
	         presets: ['react', 'es2015'] 
	       }
	     },
	     {
	        test: /\.scss$/,
	        loaders: ["style-loader", "css-loader", "sass"]
	      }
	   ]
	 },
	resolve: {
	   extensions: ['', '.js','.jsx']
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			comments: false			
		})
	]
}