var webpack = require('webpack'),
    path = require('path'),
    htmlPlugin = require('html-webpack-plugin'),
    extractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var SRC_DIR = path.join(__dirname, './src')
var DIST_DIR = path.join(__dirname, './dist')

console.log('Node environment: ' + process.env.NODE_ENV)

module.exports = {
    target: 'web',
    context: SRC_DIR,
    entry: {
        main: './application/main.tsx',
        bundleLibraries: [
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux',
        ]
    },
    devtool: 'source-map',
    output: {
        path: DIST_DIR,
        publicPath: '/',
        filename: 'app.bundle.js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    // 'react-hot-loader/webpack',
                    // 'react-hot-loader',
                    'awesome-typescript-loader'
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            }
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'bundleLibraries',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: ((process.env.NODE_ENV == 'production') ? [new UglifyJSPlugin()] : []).concat([
        new htmlPlugin({
            template: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
    ]),
    devServer: {
        historyApiFallback: true
    },
    node: {
        // workaround for webpack-dev-server issue
        // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
        fs: 'empty',
        net: 'empty'
    }
};
