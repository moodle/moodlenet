import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import {
  ResourceCardOwnerBookmarkedStoryProps,
  ResourceCardOwnerStoryProps,
  ResourceCardStoryProps,
} from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../organisms/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { NewCollectionFormValues } from '../NewCollection/types'
import { VisibilityDropdown } from '../NewResource/FieldsData'
import { Collection, CollectionProps } from './Collection'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'

const meta: ComponentMeta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'CollectionStoryProps',
    'CollectionLoggedOutStoryProps',
    'CollectionLoggedInStoryProps',
    'CollectionOwnerStoryProps',
    'CollectionAdminStoryProps',
  ],
}

const CollectionStory: ComponentStory<typeof Collection> = args => <Collection {...args} />

export const CollectionLoggedInStoryProps: CollectionProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  toggleBookmark: action('toggleBookmark'),
  isAuthenticated: true,
  isOwner: false,
  isAdmin: false,
  following: false,
  numFollowers: 23,
  bookmarked: false,
  visibility: VisibilityDropdown,
  contributorCardProps: ContributorCardStoryProps,
  formBag: SBFormikBag<NewCollectionFormValues>({
    // resources: [
    //   {
    //     type: 'Video',
    //     description: 'Another great Resource',
    //     image: 'https://picsum.photos/200/100',
    //     title: 'The little pearl of all'
    //   }
    // ],
    // category: '0215 Music and performing arts',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    image: 'https://picsum.photos/200/100',
    imageUrl: 'https://picsum.photos/200/100',
    title: 'Best collection ever',
    visibility: 'Public',
  }),
  resourceCardPropsList: [ResourceCardOwnerStoryProps, ResourceCardOwnerBookmarkedStoryProps, ResourceCardStoryProps],
  updateCollection: action('updateCollection'),
  toggleFollow: action('toggleFollow'),
  deleteCollection: action('deleteCollection'),
}

export const CollectionLoggedOutStoryProps: CollectionProps = {
  ...CollectionLoggedInStoryProps,
  isAuthenticated: false,
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
}

export const CollectionOwnerStoryProps: CollectionProps = {
  ...CollectionLoggedInStoryProps,
  isOwner: true,
}

export const CollectionAdminStoryProps: CollectionProps = {
  ...CollectionLoggedInStoryProps,
  isOwner: true,
  isAdmin: true,
}

export const LoggedOut = CollectionStory.bind({})
LoggedOut.args = CollectionLoggedOutStoryProps

export const LoggedIn = CollectionStory.bind({})
LoggedIn.args = CollectionLoggedInStoryProps

export const Owner = CollectionStory.bind({})
Owner.args = CollectionOwnerStoryProps

export const Admin = CollectionStory.bind({})
Admin.args = CollectionAdminStoryProps

export default meta
