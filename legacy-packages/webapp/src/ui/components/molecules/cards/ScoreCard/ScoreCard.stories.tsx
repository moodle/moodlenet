import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ScoreCard, ScoreCardProps } from './ScoreCard'
import './styles.scss'

const meta: ComponentMeta<typeof ScoreCard> = {
  title: 'Molecules/ScoreCard',
  component: ScoreCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
  excludeStories: ['ScoreCardStoryProps'],
}

export const ScoreCardStoryProps: ScoreCardProps = {
  kudos: 1,
  points: 2,
}

const ScoreCardStory: ComponentStory<typeof ScoreCard> = (args) => (
  <ScoreCard {...args} />
)

export const Default = ScoreCardStory.bind({})
Default.args = ScoreCardStoryProps

export default meta
