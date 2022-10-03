module.exports = {
  stories: [
    '../src/Card/Card.stories.tsx',
    '../../react-app/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    // PrimaryButtonStory,
    // '../src/**/*.stories.mdx',
    // '../src/**/*.stories.@(js|jsx|ts|tsx)',
    // '../../*/src/**/*.stories.@(js|jsx|ts|tsx)',
    // '../node_modules/@moodlenet/react-app/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    // '../../react-app/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    // '../../react-app/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    // '../../react-app/src/webapp/ui/components/atoms/PrimaryButton/Button.stories.tsx',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
}
