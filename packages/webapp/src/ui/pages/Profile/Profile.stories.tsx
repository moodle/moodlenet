import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/OverallCard/OverallCard.stories'
import { ProfileCardStoryProps } from '../../components/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/ResourceCard/ResourceCard.stories'
import { ScoreCardStoryProps } from '../../components/ScoreCard/ScoreCard.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ProfileStoryProps'],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps],
  username: 'Juanito !',
}

export const Default = ProfileStory.bind({})
Default.args = ProfileStoryProps

export default meta
