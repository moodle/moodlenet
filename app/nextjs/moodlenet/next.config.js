//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')

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

// @ts-expect-error Parameter 'name' implicitly has an 'any' type.ts(7006)
module.exports = async (...args) => {
  // @ts-expect-error Parameter 'name' implicitly has an 'any' type.ts(7006)
  const config = await nextConfigFn(...args)

  const webpack = config.webpack
  config.webpack = (wpConfig, options) => {
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
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  }
  // console.log(JSON.stringify(config, null, 2), config)
  return config
}
