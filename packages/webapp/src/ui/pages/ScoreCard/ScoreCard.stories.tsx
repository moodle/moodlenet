import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ScoreCard, ScoreCardProps as ScoreCardProps } from './ScoreCard'

const meta: ComponentMeta<typeof ScoreCard> = {
  title: 'MoodleNet/ScoreCard',
  component: ScoreCard,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    Story => (
      <div style={{ width: 200, height: 80 }}>
        <Story />
      </div>
    ),
  ],
  excludeStories:['ScoreCardProps']
}

export const ScoreCardStoryProps: ScoreCardProps = {
  kudos: 1,
  points: 2,
}

const Template: ComponentStory<typeof ScoreCard> = args => <ScoreCard {...args} />

export const Primary = Template.bind(null)
Primary.args = ScoreCardStoryProps

export default meta
