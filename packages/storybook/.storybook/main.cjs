// const react = require('@vitejs/plugin-react').default
const svgr = require('vite-plugin-svgr')
const path = require('path')
const { default: tsconfigPaths } = require('vite-tsconfig-paths')
const { mergeConfig } = require('vite')
const { readdirSync, symlinkSync, rmSync, statSync } = require('fs')

const packagesDirs = readdirSync(path.join('..')).map(pkg_name => path.join('..', pkg_name))
linkDist2SrcForViteStorybook(true)

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

const recoverHackSignals = [
  'SIGTERM',
  'SIGINT',
  // 'SIGHUP',
  'SIGBREAK',
  // 'SIGKILL',
  // 'SIGSTOP',
  // 'SIGFPE',
  // 'SIGSEGV',
  // 'SIGILL',
  'exit',
  'beforeExit',
  // 'abort',
  // 'unhandledRejection',
  // 'uncaughtException',
  'disconnect'
]
recoverHackSignals.forEach((evname) => {
  process.once(evname, () => {
    linkDist2SrcForViteStorybook(false)
    process.exit()
  })
})

function linkDist2SrcForViteStorybook(create) {
  console.log(create ? 'creating' : 'removing', 'link dist to src folder for Vite-Storybook')
  packagesDirs.forEach(pkgDir => {
    const pkgJsonFile = path.resolve(pkgDir, 'package.json')
    const pkgJson = require(pkgJsonFile)
    const pkgExports = pkgJson.exports
    if (!pkgExports || pkgDir === path.resolve(__dirname, '..')) {
      return
    }
    const distFullPath = path.resolve(pkgDir, 'dist')
    const srcFullPath = path.resolve(pkgDir, 'src')
    const distStats = statSync(distFullPath, { throwIfNoEntry: false })
    distStats && rmSync(distFullPath, { recursive: distStats.isDirectory(), force: true })
    create && symlinkSync(srcFullPath, distFullPath)
  })

}