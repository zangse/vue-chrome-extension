var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')
var copyWebpackPlugin = require('copy-webpack-plugin')
var cleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var uglifyJsConfig = {
    sourceMap: true,
    compress: {
        warnings: false,
        drop_console: false
    }
}
if (process.env.NODE_ENV === 'production') {
    uglifyJsConfig.compress.drop_console = true
}
module.exports = {
    entry: {
        main: './src/main.js',
        popup: './popup/main.js',
    }, //入口文件
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './',
        filename: '[name].main.js'
    },
    plugins: [
        new cleanWebpackPlugin(
            ['dist/*', ], 　 //匹配删除的文件
            {
                root: __dirname,
                　　　　　　　　　　 //根目录
                verbose: true,
                　　　　　　　　　　 //开启在控制台输出信息
                dry: false　　　　　　　　　　 //启用删除文件
            }
        ),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
            chunks: ["main"],
            minify: { //压缩
                removeComments: true,
                collapseWhitespace: true,
            }
        }),
        new htmlWebpackPlugin({
            filename: 'popup.html',
            template: 'popup/popup.html',
            inject: 'body',
            chunks: ["popup"],
            minify: { //压缩
                removeComments: true,
                collapseWhitespace: true,
            }
        }),
        // copy custom static assets
        new copyWebpackPlugin([{
            from: path.resolve(__dirname, 'assets/'),
            to: 'static',
            ignore: ['.*']
        }, {
            from: path.resolve(__dirname, 'src/manifest.json'),
            to: path.resolve(__dirname, 'dist/')
        }, {
            from: path.resolve(__dirname, '_locales/'),
            to: path.resolve(__dirname, 'dist/_locales')
        }]),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin(uglifyJsConfig),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin('css/[name].css')

    ],
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: path.posix.join('static', 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': resolve('src'),
            'assets': resolve('assets')
        }
    },
    performance: {
        hints: false
    },
    devtool: '#source-map'
}

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}