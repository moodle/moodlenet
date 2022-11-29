import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TagListStory } from '../../../../elements/tags'
import { TrendCard, TrendCardProps } from './TrendCard'
const meta: ComponentMeta<typeof TrendCard> = {
  title: 'Molecules/TrendCard',
  component: TrendCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['TrendCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 500 }}>
        <Story />
      </div>
    ),
  ],
}

const TrendCardStory: ComponentStory<typeof TrendCard> = (args) => (
  <TrendCard {...args} />
)

export const TrendCardStoryProps: TrendCardProps = {
  tags: TagListStory,
}

export const Default = TrendCardStory.bind({})
Default.args = TrendCardStoryProps

export default meta
