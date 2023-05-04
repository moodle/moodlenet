import type { ComponentMeta, ComponentStory } from '@storybook/react'

import type { CardProps } from './Card.js'
import { Card } from './Card.js'

const meta: ComponentMeta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CardStoryProps'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CardStoryProps: CardProps = {}

const CardStory: ComponentStory<typeof Card> = args => (
  <Card {...args}>
    <div style={{ padding: 24 }}>
      Diverse, vibrant, dynamic. The cornerstone values that define our amazing{' '}
      <span style={{ color: '#757575' }}>Cards</span>
    </div>
  </Card>
)

export const Default = CardStory.bind({})
Default.args = CardStoryProps

export default meta
