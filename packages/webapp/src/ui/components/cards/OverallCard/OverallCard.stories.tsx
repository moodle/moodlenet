import { ComponentMeta, ComponentStory } from '@storybook/react'
import { OverallCard, OverallCardProps } from './OverallCard'

const meta: ComponentMeta<typeof OverallCard> = {
  title: 'Components/Organisms/Cards/OverallCard',
  component: OverallCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['OverallCardStoryProps', 'OverallCardNoCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const OverallCardStoryProps: OverallCardProps = {
  followers: 0,
  resources: 23,
  kudos: 121,
  years: 20,
}

export const OverallCardNoCardStoryProps: OverallCardProps = {
  ...OverallCardStoryProps,
  noCard: true,
}

const OverallCardStory: ComponentStory<typeof OverallCard> = args => <OverallCard {...args} />

export const Default = OverallCardStory.bind({})
Default.args = OverallCardStoryProps

export const NoCard = OverallCardStory.bind({})
NoCard.args = OverallCardNoCardStoryProps

export default meta
