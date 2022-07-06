import CompressionPlugin from 'compression-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { cp } from 'fs/promises'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import { resolve } from 'path'
import rimraf from 'rimraf'
import webpack, { Configuration, ResolveOptions } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import VirtualModulesPlugin from 'webpack-virtual-modules'
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshTypeScript = require('react-refresh-typescript')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const { jsonBeautify } = require('beautify-json');

export default start
export type ExtensionsBag = {
  extensionsDirectoryModule: string
  webpackAliases: Record<string, string>
}
async function start({
  overrideCfg = _ => _,
  buildFolder,
  latestBuildFolder,
  virtualModules,
  baseResolveAlias,
}: {
  baseResolveAlias: ResolveOptions['alias']
  latestBuildFolder: string
  buildFolder: string
  overrideCfg?: (_: Configuration) => Configuration
  virtualModules: VirtualModulesPlugin
}) {
  const mode: Configuration['mode'] =
    process.env.NODE_ENV === 'test' ? 'none' : process.env.NODE_ENV ?? ('production' as any)
  const isDevelopment = mode === 'development'
  const wp = webpack(overrideCfg(defaultConfig()), () => {
    // a cb .. otherways err:DEP_WEBPACK_WATCH_WITHOUT_CALLBACK
    console.log(`WP CB`)
  })

  if (isDevelopment) {
    const wsConfig = wp.options.devServer!
    const server = new WebpackDevServer(wsConfig, wp)
    server.startCallback(() => {
      console.log(`Successfully started server on http://localhost:${wsConfig.port!} `)
    })
  } else {
    wp.hooks.afterDone.tap('swap folders', async wpStats => {
      if (wpStats?.hasErrors()) {
        throw new Error(`Webpack build error: ${wpStats.toString()}`)
      }
      console.log(`Webpack build done`)
      await new Promise<void>((resolve, reject) =>
        rimraf(latestBuildFolder, { disableGlob: true }, e => (e ? reject(e) : resolve())),
      )
      await cp(buildFolder, latestBuildFolder, { recursive: true })
      console.log(`done`)
    })
  }
  wp.watch({}, () => console.log(`Webpack  watched`))
  logConfig()

  return {
    compiler: wp,
    // reconfigExtAndAliases,
  }

  // function reconfigExtAndAliases() {
  //   const { webpackAliases, extensionsDirectoryModule } = getExtensionsBag()
  //   wp.options.resolve!.alias = {
  //     ...baseResolveAlias,
  //     ...webpackAliases,
  //   }
  //   virtualModules.writeModule(EXTENSIONS_MODULE, extensionsDirectoryModule)
  //   logConfig()
  //   console.log('virtualModules.writeModule', extensionsDirectoryModule)
  //   wp.watching.invalidate(() => console.log('INVALIDATED'))
  // }
  function logConfig() {
    console.log('wp aliases:', wp.options.resolve.alias)
  }

  function defaultConfig(): Configuration {
    return {
      stats: isDevelopment ? 'normal' : 'errors-only',
      mode,
      entry: ['./src/webapp/index.tsx', ...(isDevelopment ? [require.resolve('react-refresh/runtime')] : [])],
      devtool: isDevelopment ? 'inline-source-map' : undefined,
      // devtool: 'source-map',
      context: resolve(__dirname, '..'),
      watch: true,
      watchOptions: {
        aggregateTimeout: 10,
        followSymlinks: true,
      },
      devServer: isDevelopment
        ? {
            port: 3000,
            open: false,
            // liveReload: true,
            // compress: true,
            hot: true,
            historyApiFallback: true, // For react router
            static: {
              serveIndex: true,
              watch: true,
              directory: buildFolder,
            },
            proxy: {
              '/_/*': {
                target: 'http://localhost:8080',
              },
            },
            client: {
              overlay: {
                errors: true,
                warnings: false,
              },
            },
          }
        : undefined,
      output: {
        clean: true,
        path: buildFolder,
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
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        //modules: [__dirname, 'node_modules'],
        alias: baseResolveAlias,
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
            use: ['@svgr/webpack'],
          },
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            use: [
              ...(isDevelopment
                ? [
                    {
                      loader: require.resolve('ts-loader'),
                      options: {
                        getCustomTransformers: () => ({
                          before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
                        }),
                        transpileOnly: isDevelopment,
                      },
                    },
                  ]
                : []),
              {
                loader: require.resolve('babel-loader'),
                options: {
                  sourceType: 'unambiguous',
                  presets: [
                    require.resolve('@babel/preset-env'),
                    require.resolve('@babel/preset-typescript'),
                    [require.resolve('@babel/preset-react'), { development: isDevelopment, runtime: 'automatic' }],
                  ],
                  plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
                },
              },
            ], //[isDevelopment ? 'reverse' : 'slice'](), //https://github.com/ezolenko/rollup-plugin-typescript2/issues/256#issuecomment-1126969565
          },
        ],
      },
      plugins: [
        isDevelopment && new ReactRefreshWebpackPlugin(),
        // new ForkTsCheckerWebpackPlugin(),
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
        virtualModules,
      ].filter(Boolean),
    }
  }
}
