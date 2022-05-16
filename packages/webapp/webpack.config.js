const HtmlWebPackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const { jsonBeautify } = require('beautify-json');

const configTemplate = () => {

  return {
    context: path.resolve(__dirname, ''),
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: 'bundle.js',
    },
    resolve: {
      // extensions: ['.js', '.jsx'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      alias: {
        react: path.join(__dirname, 'node_modules', 'react'),
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './index.html',
        favicon: './favicon.png',
      }),
    ],
  };
}
const getConfig = (env = {}, argv = {}) => {
  const config = configTemplate()
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.entry = ['react-hot-loader/patch', './src/webapp'];
    config.devtool = 'inline-source-map';
    config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devServer = {
      compress: true,
      hot: true,
      historyApiFallback: true, // For react router
      static: {
        serveIndex: true,
        watch: true,
        directory: './build',
      },
    };
  }

  if (argv.mode === 'production') {
    config.entry = ['./src/webapp'];
    config.devtool = 'source-map';
    config.output.filename = '[name].[chunkhash].bundle.js';
    config.output.chunkFilename = '[name].[chunkhash].bundle.js';
    config.optimization = {
      moduleIds: 'hashed',
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules\/(?!antd\/).*/,
            name: 'vendors',
            chunks: 'all',
          },
          // This can be your own design library.
          antd: {
            test: /node_modules\/(antd\/).*/,
            name: 'antd',
            chunks: 'all',
          },
        },
      },
    };
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
      }),
      new CopyPlugin({
        patterns: [{ from: './_redirects' }],
      }),
    );
    config.performance = {
      hints: 'warning',
      // Calculates sizes of gziped bundles.
      assetFilter(assetFilename) {
        return assetFilename.endsWith('.js.gz');
      },
    };
  }

  // console.log('Webpack config\n');

  // jsonBeautify(config);

  return config;
};

module.exports = getConfig
module.exports.default = getConfig