import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  CollectionCardLoggedOutStoryProps,
  CollectionCardOwnerStoryProps,
  CollectionCardStoryProps
} from '../../components/cards/CollectionCard/CollectionCard.stories'
import {
  ProfileCardLoggedInStoryProps,
  ProfileCardOwnerStoryProps,
  ProfileCardStoryProps
} from '../../components/cards/ProfileCard/ProfileCard.stories'
import {
  ResourceCardLoggedInStoryProps,
  ResourceCardLoggedOutStoryProps,
  ResourceCardOwnerStoryProps
} from '../../components/cards/ResourceCard/ResourceCard.stories'
import { OverallCardStoryProps } from '../../components/molecules/cards/OverallCard/OverallCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/molecules/Header/Header.stories'
import { href } from '../../elements/link'
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
    'ProfileActivatedStoryProps',
  ],
}

const ProfileStory: ComponentStory<typeof Profile> = args => <Profile {...args} />

export const ProfileStoryProps: ProfileProps = {
  save: action('save'),
  newResourceHref: href('Pages/New Resource/Start'),
  newCollectionHref: href('Pages/New Collection/Start'),
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  overallCardProps: OverallCardStoryProps,
  profileCardProps: ProfileCardStoryProps,
  // scoreCardProps: ScoreCardStoryProps,
  collectionCardPropsList: [CollectionCardStoryProps, CollectionCardStoryProps],
  resourceCardPropsList: [
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
    ResourceCardLoggedInStoryProps,
  ],
  displayName: 'Juanito',
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
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  collectionCardPropsList: [
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
    CollectionCardLoggedOutStoryProps,
  ],
  resourceCardPropsList: [ResourceCardLoggedOutStoryProps, ResourceCardLoggedOutStoryProps],
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
  collectionCardPropsList: [
    CollectionCardOwnerStoryProps,
    CollectionCardOwnerStoryProps,
    CollectionCardOwnerStoryProps,
  ],
  resourceCardPropsList: [ResourceCardOwnerStoryProps, ResourceCardOwnerStoryProps, ResourceCardOwnerStoryProps],
}

export const ProfileActivatedStoryProps: ProfileProps = {
  ...ProfileOwnerStoryProps,
  profileCardProps: ProfileCardOwnerStoryProps,
  collectionCardPropsList: [],
  resourceCardPropsList: [],
  showAccountCreationSuccessAlert: true,
}

export const LoggedOut = ProfileStory.bind({})
LoggedOut.args = ProfileLoggedOutStoryProps

export const LoggedIn = ProfileStory.bind({})
LoggedIn.args = ProfileLoggedInStoryProps

export const Owner = ProfileStory.bind({})
Owner.args = ProfileOwnerStoryProps

export const Activated = ProfileStory.bind({})
Activated.args = ProfileActivatedStoryProps

export default meta
