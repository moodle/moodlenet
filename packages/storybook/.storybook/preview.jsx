import { baseStyle } from '../../react-app/lib/webapp/ui/styles/config.js'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  Story => (
    <div
      style={{
        // ...style,
        font: 'inherit',
        ...baseStyle(),
        // ...getColorPalette(baseMoodleColor),
        // ...styleContext.style,
      }}
    >
      <Story />
    </div>
  ),
]
