import CompressionPlugin from 'compression-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { cp, rm } from 'fs/promises'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack, { Configuration } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const { jsonBeautify } = require('beautify-json');

export default start

export type ExtensionsBag = {
  extensionsDirectoryModule: string
  webpackAliases: Record<string, string>
}
const virtualModules = new VirtualModulesPlugin()
async function start({
  overrideCfg = _ => _,
  buildFolder,
  latestBuildFolder,
}: {
  latestBuildFolder: string
  buildFolder: string
  overrideCfg?: (_: Configuration) => Configuration
}) {
  const config = overrideCfg(defaultConfig({ outputPath: buildFolder }))

  await rm(buildFolder, { recursive: true, force: true })

  const wp = webpack(config, () => {
    console.log(`webpack(config) cb (DEP_WEBPACK_WATCH_WITHOUT_CALLBACK)`)
  })

  // wp.hooks.beforeCompile.tap('del build', () => {
  //   rmSync(buildFolder, { recursive: true, force: true })
  // })
  wp.hooks.afterDone.tap('swap folders', async wpStats => {
    if (wpStats?.hasErrors()) {
      throw new Error(`Webpack build error: ${wpStats.toString()}`)
    }
    console.log(`Webpack build done`)
    await rm(latestBuildFolder, { recursive: true, force: true })

    await cp(buildFolder, latestBuildFolder, { recursive: true })
    console.log(`done`)
  })

  // wp.hooks.compilation.tap('ExtensionsModulePlugin', (/* compilation */) => {
  //   virtualModules.writeModule('src/webapp/extensions.ts', makeExtensionsDirectoryModule(shell))
  // })

  wp.watch({}, () => {
    console.log(`Webpack watched`)
  })

  return {
    config,
    refresh,
  }
  function refresh({ extensionsDirectoryModule, webpackAliases }: ExtensionsBag) {
    config.resolve!.alias = { ...baseResolveAlias, ...webpackAliases }
    virtualModules.writeModule('src/webapp/extensions.ts', extensionsDirectoryModule)
  }
}
// if (argv.mode === 'development') {
//   config.entry = ['react-hot-loader/patch', './src/webapp'];
//   config.devtool = 'inline-source-map';
//   config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
//   config.plugins.push(new webpack.HotModuleReplacementPlugin());
//   config.devServer = {
//     compress: true,
//     hot: true,
//     historyApiFallback: true, // For react router
//     static: {
//       serveIndex: true,
//       watch: true,
//       directory: './build',
//     },
//   };
// }

// jsonBeautify(config);

const defaultConfig = ({ outputPath }: { outputPath: string }): Configuration => ({
  mode: 'development',
  entry: ['./src/webapp'],
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    followSymlinks: true,
  },
  output: {
    path: outputPath,
    publicPath: '/',
    // filename: 'bundle.js',
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js',
  },
  resolve: {
    // extensions: ['.js', '.jsx'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [__dirname, 'node_modules'],
    // alias: { react: path.join(__dirname, 'node_modules', 'react') },
  },
  optimization: {
    moduleIds: 'deterministic',
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
        // antd: {
        //   test: /node_modules\/(antd\/).*/,
        //   name: 'antd',
        //   chunks: 'all',
        // },
      },
    },
  },
  performance: {
    hints: 'warning',
    // Calculates sizes of gziped bundles.
    assetFilter(assetFilename: string) {
      return assetFilename.endsWith('.js.gz')
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
        test: /\.scss$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }],
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
    virtualModules,
    new HtmlWebPackPlugin({
      template: './index.html',
      favicon: './favicon.svg',
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new CopyPlugin({
      patterns: [{ from: './_redirects' }],
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'json',
    // }),
  ],
})

const baseResolveAlias = {
  react: path.join('node_modules', 'react'),
}
