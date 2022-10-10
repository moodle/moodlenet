import { MemoryRouter } from 'react-router-dom'
import { baseStyle } from '../../component-library/lib/webapp/ui/styles/config.js'
import { Wrapper } from '../src/Wrapper'

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
    <MemoryRouter>
    <Wrapper>
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
    </Wrapper>
    </MemoryRouter>
  ),
]
