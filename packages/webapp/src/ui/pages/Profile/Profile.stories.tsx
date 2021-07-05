import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionListCardStoryProps, ResourceListCardStoryProps } from '../../components/ListCard/ListCard.stories'
import { OverallCardStoryProps } from '../../components/OverallCard/OverallCard.stories'
import { ProfileCardStoryProps } from '../../components/ProfileCard/ProfileCard.stories'
import { ScoreCardStoryProps } from '../../components/ScoreCard/ScoreCard.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

const ProfileStoryProps: ProfileProps = {
  overallCardProps:OverallCardStoryProps,
  profileCardProps:ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  collectionListCardProps: CollectionListCardStoryProps,
  resourcesListCardProps: ResourceListCardStoryProps
}

export const Default = ProfileStory.bind({})
Default.args = ProfileStoryProps

export default meta
