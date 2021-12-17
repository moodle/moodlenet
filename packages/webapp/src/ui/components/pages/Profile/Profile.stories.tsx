import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { href } from '../../../elements/link'
import {
  CollectionCardLoggedOutStoryProps,
  CollectionCardOwnerPrivateStoryProps,
  CollectionCardOwnerStoryProps,
  CollectionCardStoryProps,
} from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import { OverallCardStoryProps } from '../../molecules/cards/OverallCard/OverallCard.stories'
import {
  ProfileCardAdminStoryProps,
  ProfileCardApprovedStoryProps,
  ProfileCardLoggedInStoryProps,
  ProfileCardOwnerStoryProps,
  ProfileCardStoryProps,
} from '../../molecules/cards/ProfileCard/ProfileCard.stories'
import {
  ResourceCardLoggedInStoryProps,
  ResourceCardLoggedOutStoryProps,
  ResourceCardOwnerPrivateStoryProps,
  ResourceCardOwnerStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
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
    'ProfileAdminStoryProps',
    'ProfileApprovedStoryProps',
  ],
}

const ProfileStory: ComponentStory<typeof Profile> = (args) => (
  <Profile {...args} />
)

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
  collectionCardPropsList: [
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardStoryProps(randomIntFromInterval(1, 3)),
  ],
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
      // isAuthenticated: false,
      headerProps: {
        ...HeaderLoggedOutStoryProps,
        me: null,
      },
      // subHeaderProps: {
      //   tags: [],
      // },
    },
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  collectionCardPropsList: [
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardLoggedOutStoryProps(randomIntFromInterval(1, 3)),
  ],
  resourceCardPropsList: [
    ResourceCardLoggedOutStoryProps,
    ResourceCardLoggedOutStoryProps,
  ],
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
    CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardOwnerStoryProps(randomIntFromInterval(1, 3)),
    CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(1, 3)),
  ],
  resourceCardPropsList: [
    ResourceCardOwnerPrivateStoryProps,
    ResourceCardOwnerStoryProps,
    ResourceCardOwnerStoryProps,
    ResourceCardOwnerPrivateStoryProps,
    ResourceCardOwnerStoryProps,
  ],
}

export const ProfileApprovedStoryProps: ProfileProps = {
  ...ProfileOwnerStoryProps,
  profileCardProps: ProfileCardApprovedStoryProps,
  showAccountApprovedSuccessAlert: true,
}

export const ProfileActivatedStoryProps: ProfileProps = {
  ...ProfileOwnerStoryProps,
  profileCardProps: ProfileCardOwnerStoryProps,
  collectionCardPropsList: [],
  resourceCardPropsList: [],
  showAccountCreationSuccessAlert: true,
}

export const ProfileAdminStoryProps: ProfileProps = {
  ...ProfileLoggedInStoryProps,
  profileCardProps: ProfileCardAdminStoryProps,
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

export const Approved = ProfileStory.bind({})
Approved.args = ProfileApprovedStoryProps

export const Activated = ProfileStory.bind({})
Activated.args = ProfileActivatedStoryProps

export const Admin = ProfileStory.bind({})
Admin.args = ProfileAdminStoryProps

export default meta
