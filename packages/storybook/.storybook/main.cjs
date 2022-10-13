const react = require('@vitejs/plugin-react').default
const svgr = require('vite-plugin-svgr')
const { mergeConfig } = require('vite')


module.exports = {
  stories: [
    //'../src/stories/*.stories.tsx',
    // '/home/alec/MOODLENET/repo/moodlenet3/packages/storybook/src/stories/*CL*.stories.tsx',
    // './src/stories/CL.stories.tsx',
    // '../../component-library/src/webapp/ui/components/atoms/Card/Card.stories.tsx',
    '../../component-library/src/webapp/ui/components/**/*.stories.tsx',
    // '../../web-user/src/webapp/**/*.stories.tsx',
    // '../../component-library/src/webapp/ui/components/organisms/Header/HeaderTitle/HeaderTitle.stories.tsx',
    // '../src/**/*.stories.mdx',
    // '../src/**/*.stories.@(js|jsx|ts|tsx)',
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
      plugins: [/* react(), */ svgr()],
      // optimizeDeps: {
      //   include: ['storybook-dark-mode'],
      // },
    })
  },
}
