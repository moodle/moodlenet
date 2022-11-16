import CompressionPlugin from 'compression-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { cp } from 'fs/promises'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import { createRequire } from 'module'
import { resolve } from 'path'
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin'
import rimraf from 'rimraf'
import { fileURLToPath } from 'url'
import type { Configuration, ResolveOptions } from 'webpack'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import VirtualModulesPlugin from 'webpack-virtual-modules'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

// const ResolveTypeScriptPlugin = require('resolve-typescript-plugin').default
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// const ReactRefreshTypeScript = require('react-refresh-typescript')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const { jsonBeautify } = require('beautify-json');

export default startProdWp
export type ExtensionsBag = {
  extensionsDirectoryModule: string
  webpackAliases: Record<string, string>
}
export function startProdWp({
  // overrideCfg = _ => _,
  buildFolder,
  latestBuildFolder,
  // virtualModules,
  baseResolveAlias,
}: {
  baseResolveAlias: ResolveOptions['alias']
  latestBuildFolder: string
  buildFolder: string
  // overrideCfg?: (_: Configuration) => Configuration
  // virtualModules: VirtualModulesPlugin
}) {
  const wp = getWp({ baseResolveAlias, buildFolder, mode: 'prod' })
  // console.log({ baseResolveAlias, latestBuildFolder, buildFolder })

  wp.hooks.afterDone.tap('swap folders', async wpStats => {
    if (wpStats?.hasErrors()) {
      throw new Error(`Webpack build error: ${wpStats.toString()}`)
    }
    await new Promise<void>((rimrafResolve, rimrafReject) =>
      rimraf(resolve(latestBuildFolder, '*'), { disableGlob: true }, e =>
        e ? rimrafReject(e) : rimrafResolve(),
      ),
    )
    await cp(buildFolder, latestBuildFolder, { recursive: true })
  })

  wp.watch({}, () => {
    /* console.log(`Webpack  watched`) */
  })

  return {
    compiler: wp,
    // reconfigExtAndAliases,
  }
}

export function getWp(
  cfg:
    | {
        mode: 'prod'
        buildFolder: string
        baseResolveAlias: ResolveOptions['alias']
      }
    | {
        baseResolveAlias: ResolveOptions['alias']
        mode: 'dev-server'
        port: number
        proxy: string
      },
) {
  const isDevServer = cfg.mode === 'dev-server'
  const mode: Configuration['mode'] = isDevServer ? 'development' : 'production'

  const config: Configuration = {
    stats: isDevServer ? 'normal' : 'errors-only',
    mode,
    // entry: ['./src/webapp/index.tsx', ...(isDevServer ? [require.resolve('react-refresh/runtime')] : [])],
    entry: [
      './lib/webapp/index.js',
      ...(isDevServer ? [require.resolve('react-refresh/runtime')] : []),
    ],
    devtool: 'eval-source-map', // isDevServer ? 'inline-source-map' : undefined,
    // devtool: 'source-map',
    context: resolve(__dirname, '..', '..'),
    watch: true,
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
      extensions: ['.ts', '.mts', '.tsx', '.js', '.mjs', '.jsx'],
      //modules: [__dirname, 'node_modules'],
      alias: cfg.baseResolveAlias,
      // fullySpecified: true,
      plugins: [new ResolveTypeScriptPlugin({ includeNodeModules: true })],
    },
    experiments: {
      topLevelAwait: true,
    },
    optimization: {
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
    cache: true,
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
                  console.log(inspect({ content, loaderContext }, false, 2, true))
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
          exclude: /node_modules/,
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
                  require.resolve('@babel/preset-typescript'),
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