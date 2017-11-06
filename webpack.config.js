var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var publicPath="http://localhost:8000/";
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true&timeout=500';

var dev=process.env.NODE_ENV;
var publicPath=dev=='dev'?"http://localhost:8000/":'http://localhost/dist/';
var plugins	= [];


module.exports={
	entry:dev=='dev'?['./main.js',hotMiddlewareScript]:'./main.js',
	output:{
		filename:'js/app.js',
		path:path.resolve(__dirname,'dist'),
		publicPath:publicPath
	},
	module : {
		rules:[
			{test: require.resolve("jquery"), use: "expose-loader?$"},
			{test: require.resolve("jquery"), use: "expose-loader?jQuery"},
			{test:/\.css$/, use:[ 'style-loader', 'css-loader' ]},
			{test:/\.(png|jpg|gif)$/,use:{loader:'url-loader',options:{
				limit:8192,
				name:'images/[name][hash:5].[ext]'
			}}},
			{test:/\.js$/,use:{loader:'babel-loader',options:{presets:['env']}}},
			{test:/\.html$/,use:{loader:'html-loader',options:{}}},
			{test:/\.ejs$/,use:{loader:'ejs-loader',options:{}}},
			{test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,use:{loader:'url-loader',options:{
				limit:50000,
				name:'media/[name].[ext]'
			}}},
			{test:/\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,use:{loader:'url-loader',options:{
				limit:50000,
				name:'fonts/[name].[ext]'
			}}}
		],
	},
	plugins:[
		new HtmlWebpackPlugin({
			title:'测试',
			inject:true,
			filename:'index.html',
			template:'./src/template/test/test.ejs',
			userName:'99天',
			userId:'778899'
		}),
		// new ExtractTextPlugin('css/style.css'),
		// new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
}