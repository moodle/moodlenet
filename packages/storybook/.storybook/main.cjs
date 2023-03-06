// const react = require('@vitejs/plugin-react').default
const svgr = require('vite-plugin-svgr')
const { default: tsconfigPaths } = require('vite-tsconfig-paths')
const { mergeConfig } = require('vite')
const { readdirSync } = require('fs')
const { hackPackageJsonExports } = require('./hackPackageJsonExports.cjs')
const path = require('path')

const packagesDirs = readdirSync(path.join('..')).map(pkg_name => path.join('..', pkg_name))
hackPackageJsonExports()

const recoverHackSignals = [
  'SIGTERM',
  'SIGINT',
  'SIGHUP',
  'SIGBREAK',
  // 'SIGKILL',
  // 'SIGSTOP',
  'SIGBUS',
  'SIGFPE',
  'SIGSEGV',
  'SIGILL',
  'exit',
  'beforeExit',
  'abort',
  'unhandledRejection',
  'uncaughtException',
  'disconnect',
]
recoverHackSignals.forEach(evname => {
  process.once(evname, () => hackPackageJsonExports(true))
})

module.exports = {
  stories: [
    '../src/components/**/*.stories.tsx',
    '../../component-library/src/webapp/ui/components/**/*.stories.tsx',
    '../../react-app/src/webapp/ui/components/**/*.stories.tsx',
    '../../resource/src/webapp/components/**/*.stories.tsx',
    // '../../packages/component-library/src/webapp/ui/components/**/*.stories.tsx',
    //'../src/stories/*.stories.tsx',
    // '../../component-library/src/webapp/ui/components/atoms/Card/Card.stories.tsx',
    // '../../component-library/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    // '../../packages/component-library/src/webapp/ui/components/**/*.stories.tsx',
    // '../../component-library/src/webapp/ui/components/organisms/Header/HeaderTitle/HeaderTitle.stories.tsx',
    // '../src/**/*.stories.mdx',
    // '../../*/src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      plugins: [tsconfigPaths({ projects: packagesDirs }), svgr()],
    })
  },
}
