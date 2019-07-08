const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const config = require('../config')

const extractSass = new ExtractTextPlugin('./css/[name].min.css')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        index: './ui/common_backends/index.js',
        vendors: [
            'react',
            'react-dom',
            'react-redux',
            'react-cookie',
            'react-router-redux',
            'react-router-dom',
            'react-smooth-scrollbar',
            'react-dnd-html5-backend',
            'react-dnd',
            'react-big-calendar',
            'history',

            'redux',
            'redux-api-middleware',
            'redux-thunk',
            'redux-logger',

            'isomorphic-fetch',
            'react-google-maps',
            'react-fontawesome',
            'lodash',
            'moment',
            'bluebird',
            'react-chartjs-2'
        ],
        antd: ['antd']
    },
    output: {
        path: path.join(__dirname, 'backend_asset'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        "es2015",
                        "stage-0",
                        "react"
                    ],
                    plugins: ['transform-runtime']
                }
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: extractSass.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        module: true,
                        localIdentName: '[local]___[hash:base64:5]'
                    }
                },
                    'sass-loader',
                    'postcss-loader']
            })
        }, {
            test: /\.(png|jpg|)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 200000
                }
            }]
        }]
    },
    plugins: [
        extractSass,
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'antd'],
            filename: '[name].min.js',
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new UglifyJsPlugin()
    ]
}