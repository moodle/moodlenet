module.exports = {
  "stories": [
    //"../src/**/**/*.stories.mdx",
    //"../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/ui/**/*.stories.mdx",
    "../src/ui/**/*.stories.tsx",
    "../src/ui/**/**/*.stories.tsx",
    "../src/ui/**/**/**/*.stories.tsx",
  ],
  "addons": [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "storybook-addon-linguijs"
  ]
}