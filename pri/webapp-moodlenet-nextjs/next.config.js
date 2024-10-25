//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
// const { inspect } = require('node:util')

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
]

const nextConfigFn = composePlugins(...plugins)(nextConfig)

/**
 * @type {import('@nx/next/src/utils/config').NextConfigFn}
 **/
const xport = async (phase, context) => {
  const config = await nextConfigFn(phase, context)

  const webpack = config.webpack
  config.webpack = (wpConfig, options) => {

    // https://github.com/vercel/next.js/issues/28774#issuecomment-1208649870
    // wpConfig.plugins = wpConfig.plugins ?? []
    // wpConfig.plugins.push(
    //   new wp.NormalModuleReplacementPlugin(/^node:/, (resource) => {
    //     resource.request = resource.request.replace(/^node:/, '')
    //   })
    // )
    // ------------------

    // @ts-expect-error Parameter 'name' implicitly has an 'any' type.ts(7006)
    const fileLoaderRule = wpConfig.module.rules.find(rule => rule.test?.test?.('.svg'))
    // wpConfig.module.rules.push(
    //   // Reapply the existing rule, but only for svg imports ending in ?url
    //   {
    //     ...fileLoaderRule,
    //     test: /\.svg$/i,
    //     resourceQuery: /url/, // *.svg?url
    //   },
    //   // Convert all other *.svg imports to React components
    //   {
    //     test: /\.svg$/i,
    //     issuer: fileLoaderRule.issuer,
    //     resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
    //     use: ['@svgr/webpack'],
    //   },
    // )
    // // Modify the file loader rule to ignore *.svg, since we have it handled now.
    // fileLoaderRule.exclude = /\.svg$/i

    //https://github.com/vercel/next.js/discussions/52690#discussioncomment-8235460
    // wpConfig.module.rules.push({
    //   test: /\.svg$/,
    //   use: ['@svgr/webpack', 'url-loader'],
    // });

    // from v4
    wpConfig.module.rules.push({
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
    },)

    return webpack?.(wpConfig, options)
  }
  config.experimental = {
    externalDir: true,
    instrumentationHook: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  }

  // https://github.com/vercel/next.js/discussions/26420#discussioncomment-1415418 (https://github.com/vercel/next.js/discussions/50861)
  // config.transpilePackages = [
  //   ...(config.transpilePackages ?? []),
  //   '@moodle/bindings-node',
  //   '@moodle/lib-types',
  //   '@moodle/domain',
  //   '@moodle/core-i am/lib',
  //   '@moodle/domain',
  // ]
  // config.serverRuntimeConfig = require('../../../../domain/src/index')
  // config.serverRuntimeConfig = require('@moodle/domain')

  return config
}

module.exports = xport
