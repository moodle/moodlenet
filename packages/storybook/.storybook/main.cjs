// const react = require('@vitejs/plugin-react').default
//const svgr = require('vite-plugin-svgr')
const { mergeConfig } = require('vite')
const { hackPackageJsonExports } = require('./hackPackageJsonExports.cjs')
//const react = require('@vitejs/plugin-react')
const { readdirSync } = require('fs')
const path = require('path')
const svgr = require('vite-plugin-svgr').default
const tsconfigPaths = require('vite-tsconfig-paths').default

const packagesDirs = readdirSync(path.resolve(__dirname, '..', '..')).map(pkg_name =>
  path.resolve(__dirname, '..', '..', pkg_name),
)

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
    '../../ed-resource/src/webapp/components/**/*.stories.tsx',
    '../../web-user/src/webapp/ui/components/**/*.stories.tsx',
    // '../../ed-meta/src/webapp/components/**/*.stories.tsx',
    // '../../component-library/src/webapp/ui/components/atoms/RoundButton/RoundButton.stories.tsx'
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

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  features: {
    storyStoreV7: true,
  },

  // docs: {
  //   autodocs: true
  // }
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths({ projects: packagesDirs }),
        // react({
        //   jsxRuntime: 'automatic',
        // }),
        svgr(),
      ],
      optimizeDeps: {
        include: [
          '@emotion/styled',
          '@emotion/react',
          '@mui/icons-material',
          '@mui/material',
          'react-router-dom',
        ],
      },
    })
  },

  core: {
    disableWhatsNewNotifications: false,
  },
}
