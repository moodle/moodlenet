module.exports = {
  "stories": [
    //"../src/**/**/*.stories.mdx",
    //"../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/ui/components/**/*.stories.mdx",
    "../src/ui/components/**/*.stories.tsx",
    "../src/ui/components/**/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "storybook-addon-linguijs"
  ]
}