module.exports = {
  stories: [
    '../../component-library/src/webapp/ui/components/**/*.stories.tsx',
    '../../component-library/src/webapp/ui/components/atoms/PrimaryButton/PrimaryButton.stories.tsx',
    '../../component-library/src/webapp/ui/components/atoms/Card/Card.stories.tsx',
    '../../web-user/src/webapp/ProfilePage/OverallCard/OverallCard.stories.tsx',
    '../../component-library/src/webapp/ui/components/organisms/Header/HeaderTitle/HeaderTitle.stories.tsx',
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
