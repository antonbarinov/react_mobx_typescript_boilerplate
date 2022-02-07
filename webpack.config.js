const webpack = require('webpack');
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { DuplicatesPlugin } = require('inspectpack/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// Plugins -- END

const path = require('path');
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const NODE_ENV = process.env.NODE_ENV;
const dev = NODE_ENV !== 'production';
const hashType = dev ? '[hash]' : '[contenthash]';

let devPlugins = [];
let prodPlugins = [];
if (dev) {
    devPlugins = [];
}
if (!dev) {
    prodPlugins = [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: `[name].${hashType}.css`,
            chunkFilename: `[id].${hashType}.css`,
        }),
        new BundleAnalyzerPlugin({
            analyzerPort: 'auto',
            analyzerMode: 'static',
        }),
    ];
}

function stylesLoaders(useModules = false) {
    const m = {};
    if (useModules) {
        m.modules = {
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
        };
    }

    return [
        dev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 3,
                ...m,
                sourceMap: dev,
            },
        },
        'resolve-url-loader',
        'postcss-loader',
        {
            loader: 'sass-loader',
            options: {
                // Prefer `dart-sass`
                implementation: require('sass'),
            },
        },
    ];
}

function buildTime() {
    const iso = new Date().toISOString();
    let [date, time] = iso.split('T');
    date = date
        .split('-')
        .reverse()
        .join('.');
    time = time.substr(0, 8);

    return date + ' ' + time;
}

module.exports = {
    mode: dev ? 'development' : 'production',
    entry: {
        bundle: ['./src/index.tsx'],
    },
    output: {
        filename: `[name].${hashType}.js`,
        path: __dirname + '/dist',
        publicPath: '/',
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    devServer: {
        openPage: '../../',
        port: 8091,
        open: true,
        historyApiFallback: true,
        disableHostCheck: true,
        liveReload: false,
        publicPath: '/',
        contentBase: path.join(__dirname, 'src'),
        host: '0.0.0.0',
        useLocalIp: true,
        proxy: {
            '/api': {
                target: 'https://thy2j.sse.codesandbox.io',
                pathRewrite: { '^/api': '' },
                secure: false,
                changeOrigin: true,
            },
        },
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: dev ? 'source-map' : false,

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        modules: [path.resolve('./src'), path.resolve('./node_modules')],
    },

    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/, // .js .jsx .ts .tsx
                loader: 'ts-loader',
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.module\.(c|sa|sc)ss$/,
                oneOf: [
                    {
                        resourceQuery: '?no_modules',
                        use: stylesLoaders(false),
                    },
                    {
                        use: stylesLoaders(true),
                    },
                ],
            },
            {
                test: /\.(c|sa|sc)ss$/,
                exclude: /\.module\.(c|sa|sc)ss$/,
                use: stylesLoaders(false),
            },
            {
                test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
                oneOf: [
                    {
                        resourceQuery: '?raw',
                        use: ['raw-loader'],
                    },
                    {
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: dev ? `[path]__[name]__${hashType}.[ext]` : `${hashType}.[ext]`,
                                    outputPath: `./assets/file-loader/`,
                                    publicPath: '',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            process: {
                env: {
                    NODE_ENV: JSON.stringify(NODE_ENV),
                    buildTime: JSON.stringify(new Date().getTime()),
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets',
                to: './assets',
            },
        ]),
        new CaseSensitivePathsPlugin(),
        new DuplicatesPlugin(),
        ...devPlugins,
        ...prodPlugins,
    ],
};
