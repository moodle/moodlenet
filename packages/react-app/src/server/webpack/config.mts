import CompressionPlugin from 'compression-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import { createRequire } from 'module'
import { resolve } from 'path'
// import ResolveTypeScriptPlugin from 'resolve-typescript-plugin'
import { fileURLToPath } from 'url'
import type { Configuration } from 'webpack'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { getAliases, getPkgPlugins } from './generated-files.mjs'
// import VirtualModulesPlugin from 'webpack-virtual-modules'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

// const ResolveTypeScriptPlugin = require('resolve-typescript-plugin').default
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// const ReactRefreshTypeScript = require('react-refresh-typescript')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const { jsonBeautify } = require('beautify-json');

export async function getWp(
  cfg:
    | {
        mode: 'prod'
        buildFolder: string
      }
    | {
        mode: 'dev-server'
        port: number
        proxy: string
      },
) {
  const isDevServer = cfg.mode === 'dev-server'
  const mode: Configuration['mode'] = isDevServer ? 'development' : 'production'
  const alias = await getAliases()
  const pkgPlugins = await getPkgPlugins()
  const config: Configuration = {
    stats: isDevServer ? 'normal' : 'errors-only',
    mode,
    // entry: ['./src/webapp/index.tsx', ...(isDevServer ? [require.resolve('react-refresh/runtime')] : [])],
    entry: [
      './dist/webapp/index.js',
      ...(isDevServer ? [require.resolve('react-refresh/runtime')] : []),
    ],
    devtool: isDevServer ? 'eval-source-map' : undefined,
    // devtool: 'source-map',
    context: resolve(__dirname, '..', '..', '..'),
    watch: isDevServer,
    watchOptions: {
      aggregateTimeout: 10,
      followSymlinks: true,
    },
    // experiments: {
    //     outputModule: true,
    // },

    devServer: isDevServer
      ? {
          port: cfg.port,
          open: true,
          liveReload: true,
          compress: true,
          hot: true,
          historyApiFallback: true, // For react router
          static: {
            serveIndex: true,
            watch: true,
            publicPath: '/',
            // directory: buildFolder,
          },
          proxy: {
            path: (pathname, _req) => {
              // console.log({ pathname, test: /\/\..*/.test(pathname) })
              return /\/\..*/.test(pathname)
            },
            target: cfg.proxy,
          },
          client: {
            overlay: {
              errors: true,
              warnings: false,
            },
          },
        }
      : undefined,
    output: isDevServer
      ? undefined
      : {
          clean: true,
          path: cfg.buildFolder,
          pathinfo: 'verbose',
          publicPath: '/',
          /*  ...(isDevelopment
        ? {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
          }
        : { */
          filename: `[name].[chunkhash].bundle.js`,
          chunkFilename: `[name].[chunkhash].chunk.js`,
          /*  }), */
        },
    resolve: {
      cache: true,
      extensions: [/* '.ts', '.mts', '.tsx',  */ '.js', '.mjs', '.jsx'],
      //modules: [__dirname, 'node_modules'],
      alias,
      // fullySpecified: true,
      plugins: [], //new ResolveTypeScriptPlugin({ includeNodeModules: true })],
    },
    experiments: {
      topLevelAwait: true,
    },
    optimization: isDevServer
      ? undefined
      : {
          moduleIds: 'deterministic',
          runtimeChunk: 'single',
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
    cache: isDevServer,
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
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'sass-loader' /* ,
              options: {
                additionalData: (content: any, loaderContext: any) => {
                  // More information about available properties https://webpack.js.org/api/loaders/
                  // const { resourcePath, rootContext } = loaderContext;
                  // const relativePath = path.relative(rootContext, resourcePath);

                  // if (relativePath === "styles/foo.scss") {
                  //   return "$value: 100px;" + content;
                  // }

                  // return "$value: 200px;" + content;
                  return content
                },
              }, */,
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
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                prettier: false,
                svgo: false,
                svgoConfig: {
                  plugins: [{ removeViewBox: false }],
                },
                titleProp: true,
                ref: true,
              },
            },
            {
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash].[ext]',
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
        {
          test: /\.[jt]sx?$/,
          // TODO //@ALE: is there a way to ignore /node_modules/ except for "installed mn packages" ?
          // node_modules\/(?!@m\/xx$)(?!@m\/yy$)(?!a$)(?!a$).*
          // https://regexr.com/73d26
          // exclude: /node_modules/, // HACK: removed because it won't compile jsx from within system's installed packages .. but this way it IS heavier..
          exclude: val => {
            const regexStr =
              pkgPlugins.reduce((_, { guestPkgId }) => {
                return `${_}(?!${guestPkgId.name.replace('/', '\\/')}\\/)`
              }, 'node_modules\\/') + '.*'
            const excludeRegex = new RegExp(regexStr)
            const excluded = excludeRegex.test(val)
            // !excluded && console.log(` notExcluding: ${val} `)
            return excluded
          },
          use: [
            ...(isDevServer
              ? [
                  // {
                  //   loader: require.resolve('ts-loader'),
                  //   options: {
                  //     getCustomTransformers: () => ({
                  //       before: [isDevServer && ReactRefreshTypeScript()].filter(Boolean),
                  //     }),
                  //     transpileOnly: isDevServer,
                  //     // configFile: resolve(__dirname, '..', 'tsconfig.json'),
                  //     compilerOptions: { sourceMap: true },
                  //   },
                  // },
                ]
              : []),
            {
              loader: require.resolve('babel-loader'),
              options: {
                sourceType: 'unambiguous',
                presets: [
                  require.resolve('@babel/preset-env'),
                  require.resolve('@babel/preset-modules'),
                  // require.resolve('@babel/preset-typescript'),
                  // require.resolve('@babel/plugin-transform-modules-commonjs'),
                  [
                    require.resolve('@babel/preset-react'),
                    { development: isDevServer, runtime: 'automatic' },
                  ],
                ],
                plugins: [isDevServer && require.resolve('react-refresh/babel')].filter(Boolean),
              },
            },
          ], //[isDevelopment ? 'reverse' : 'slice'](), //https://github.com/ezolenko/rollup-plugin-typescript2/issues/256#issuecomment-1126969565
        },
      ],
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/^node:/, resource => {
        // resource.request = resource.request.replace(/^node:/, '')
        const url = resource.request
        const newUrl = require.resolve(url.replace(/^node:/, '') + '/')
        console.log({ url, newUrl })
        resource.request = newUrl
      }),
      // new webpack.NormalModuleReplacementPlugin(/.mjs$/, resource => {
      //   // resource.request = resource.request.replace(/^node:/, '')
      //   const url = resource.request
      //   // const newUrl = url.endsWith('.mjs') ? require.resolve(url.replace(/.mjs$/, '.mts')) : url
      //   const newUrl = url.endsWith('.mjs') ? require.resolve(url.replace(/.mjs$/, '')) : url
      //   console.log({ url, newUrl })
      //   resource.request = newUrl
      // }),
      isDevServer && new ReactRefreshWebpackPlugin(),
      isDevServer && new webpack.HotModuleReplacementPlugin(),
      // new ForkTsCheckerWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: './public/index.html',
        inject: true,
        favicon: './public/favicon.svg',
        filename: 'index.html',
        publicPath: '/',
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
      // virtualModules,
    ].filter(Boolean),
  }
  const wp = webpack(config, _err => {
    // a cb .. otherways err:DEP_WEBPACK_WATCH_WITHOUT_CALLBACK
  })

  if (isDevServer) {
    const server = new WebpackDevServer(config.devServer, wp)
    server.startCallback(() => void 0)
  }
  return wp
}
