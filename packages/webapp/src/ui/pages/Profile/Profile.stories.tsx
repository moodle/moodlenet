import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import {
  ProfileCardLoggedInStoryProps,
  ProfileCardOwnerStoryProps,
  ProfileCardStoryProps,
} from '../../components/cards/ProfileCard/ProfileCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Profile, ProfileProps } from './Profile'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'ProfileStoryProps',
    'ProfileLoggedOutStoryProps',
    'ProfileLoggedInStoryProps',
    'ProfileOwnerStoryProps',
  ],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  save: action('save'),
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  // scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
  username: 'Juanito',
}

export const ProfileLoggedOutStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      isAuthenticated: false,
      headerProps: {
        ...HeaderLoggedOutStoryProps,
        me: null,
      },
      subHeaderProps: {
        tags: [],
      },
    },
  },
}

export const ProfileLoggedInStoryProps: ProfileProps = {
  ...ProfileStoryProps,
  headerPageTemplateProps: {
    ...ProfileStoryProps.headerPageTemplateProps,
    isAuthenticated: true,
  },
  profileCardProps: ProfileCardLoggedInStoryProps,
}

export const ProfileOwnerStoryProps: ProfileProps = {
  ...ProfileLoggedInStoryProps,
  profileCardProps: ProfileCardOwnerStoryProps,
}

export const LoggedOut = ProfileStory.bind({})
LoggedOut.args = ProfileLoggedOutStoryProps

export const LoggedIn = ProfileStory.bind({})
LoggedIn.args = ProfileLoggedInStoryProps

export const Owner = ProfileStory.bind({})
Owner.args = ProfileOwnerStoryProps

export default meta
