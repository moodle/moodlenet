import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Card } from './Card.js'
const meta = {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CardStoryProps'],
  decorators: [
    Story => _jsx('div', { style: { height: 100, width: 300 }, children: _jsx(Story, {}) }),
  ],
}
export const CardStoryProps = {}
const CardStory = args =>
  _jsx(Card, {
    ...args,
    children: _jsxs('div', {
      style: { padding: 24 },
      children: [
        'Diverse, vibrant, dynamic. The cornerstone values that define our amazing',
        ' ',
        _jsx('span', { style: { color: '#757575' }, children: 'Cards' }),
      ],
    }),
  })
export const CardDefault = CardStory.bind({})
CardDefault.args = CardStoryProps
export default meta
//# sourceMappingURL=Card.stories.js.map
