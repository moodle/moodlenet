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
  // console.log({ phase, context })
  const webpack = config.webpack
  config.webpack = (wpConfig, options) => {
    // console.log({ wpConfig, options })
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
    wpConfig.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

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
  config.transpilePackages = [
    ...(config.transpilePackages ?? []),
    '@moodle/core/transport',
    '@moodle/core/domain',
    '@moodle/lib/types',
    '@moodle/domain/mod/moodle/net',
  ]
  // config.serverRuntimeConfig = require('../../domain/src/index')
  // config.serverRuntimeConfig = require('@moodle/domain')
  // console.log(inspect(config, true, 10, true), config)
  return config
}

module.exports = xport
