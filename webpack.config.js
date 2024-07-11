const path = require('path');
// const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const publicFolder = "./src/public";
const jsPath = "./src/public/js/";
const publicRoutes = "./src/public/js/routes/";

module.exports = {
	devtool: "source-map",
	mode: "development",
	entry: {
		route_meeti_index: {
			import: [
				`${publicRoutes}meeti/index.js`
			],
			filename: "js/routes/meeti/index.js",
		},
		route_user_meeti_create: {
			import: [
				`${publicRoutes}user/meeti/create.js`
			],
			filename: "js/routes/user/meeti/create.js",
		},
		route_user_meeti_edit: {
			import: `${publicRoutes}user/meeti/edit.js`,
			filename: "js/routes/user/meeti/edit.js",
		},
	},
    module: {
        rules: [{
			// Load css files
			test: /\.css$/i,
			use: "css-loader"
		}, {
			test: /\.s[ac]ss$/i,
			use: [
				"style-loader",
				"css-loader",
				"sass-loader"
			]
		}, {
			test: /\.js$/,
			// test: /\.(?:js|mjs|cjs)$/,
			// exclude: /node_modules/,
			include: [
				path.resolve(__dirname, "src/public")
			],
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						"@babel/preset-env",
					]
				}
			}
		},
			// {
			// 	test: /\.(png|jpg|jpeg|gif)$/i,
			// 	type: 'asset/resource',
			// 	use: {
			// 		loader: "file-loader",
			// 	},
			// }
		]
    },
    output: {
        // filename: "[name].js",
        path: path.resolve("public"),
        assetModuleFilename: '[name][ext]'
    },
    plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: process.env.NODE_ENV || "development",
			SERVICE_EMAIL: process.env.SERVICE_EMAIL || "",
		}),
        // new CopyPlugin({
        //     patterns: [
        //         { from: "src/public/image", to: "image" }
        //     ]
        // })
    ]
};
