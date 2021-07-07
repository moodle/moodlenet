import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/CollectionCard/CollectionCard.stories'
import { ProfileCardStoryProps } from '../../components/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/ResourceCard/ResourceCard.stories'
import { ScoreCardStoryProps } from '../../components/ScoreCard/ScoreCard.stories'
import { Landing, LandingProps } from './Landing'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['LandingStoryProps'],
}

const LandingStory: ComponentStory<typeof Landing> = args => <Landing {...args} />

export const LandingStoryProps: LandingProps = {
  profileCardProps: ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps],
  organization: {
    name: "Bern University of Applied Sciences"
  }
}

export const Default = LandingStory.bind({})
Default.args = LandingStoryProps

export default meta
