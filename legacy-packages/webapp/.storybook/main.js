module.exports = {
  "stories": [
    "../src/ui/components/pages/Landing/Landing.stories.tsx",
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
  ],
  typescript: {
    // check: false
  }
}