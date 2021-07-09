import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ProfileCardStoryProps } from '../../components/cards/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { ScoreCardStoryProps } from '../../components/cards/ScoreCard/ScoreCard.stories'
import { HeaderStoryProps } from '../../components/Header/Header.stories'
import { PageHeaderStoryProps } from '../PageHeader/PageHeader.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: {layout: 'fullscreen'},
  excludeStories: ['ProfileStoryProps', 'ProfileLoggedOutStoryProps', 'ProfileLoggedInStoryProps'],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  pageHeaderProps: PageHeaderStoryProps,
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps],
  username: 'Juanito',
}

export const ProfileLoggedOutStoryProps: ProfileProps = {
  ...ProfileStoryProps, 
  pageHeaderProps: {
    ...PageHeaderStoryProps, 
    headerProps: {
      ...HeaderStoryProps, 
      me: null
    }
  }
}

export const ProfileLoggedInStoryProps: ProfileProps = {
  ...ProfileStoryProps, 
  pageHeaderProps: {
    ...PageHeaderStoryProps, 
    headerProps: {
      ...HeaderStoryProps, 
      me: {username: 'Juanito'}
    }
  }
}

export const LoggedOut = ProfileStory.bind({})
LoggedOut.args = ProfileLoggedOutStoryProps

export const LoggedIn = ProfileStory.bind({})
LoggedIn.args = ProfileLoggedInStoryProps

export default meta
