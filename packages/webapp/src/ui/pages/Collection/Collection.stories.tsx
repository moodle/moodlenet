import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SBFormikBag } from '../../lib/storybook/SBFormikBag'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { CategoriesDropdown } from '../NewCollection/FieldsData'
import { NewCollectionFormValues } from '../NewCollection/types'
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
  ],
}

const CollectionStory: ComponentStory<typeof Collection> = args => <Collection {...args} />

export const CollectionLoggedInStoryProps: CollectionProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  isAuthenticated: true,
  isOwner: false,
  following: false,
  bookmarked: false,
  contributorCardProps: ContributorCardStoryProps,
  overallCardProps: OverallCardStoryProps,
  formBag: SBFormikBag<NewCollectionFormValues>({
    // resources: [
    //   {
    //     type: 'Video',
    //     description: 'Another great Resource',
    //     image: 'https://picsum.photos/200/100',
    //     title: 'The little pearl of all'
    //   }
    // ],
    category: '0215 Music and performing arts',
    description:
      'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
    image: 'https://picsum.photos/200/100',
    title: 'Best Collection Ever',
  }),
  categories: CategoriesDropdown,
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
  updateCollection: action('updateCollection'),
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
  },
}

export const CollectionOwnerStoryProps: CollectionProps = {
  ...CollectionLoggedInStoryProps,
  isOwner: true,
}

export const LoggedOut = CollectionStory.bind({})
LoggedOut.args = CollectionLoggedOutStoryProps

export const LoggedIn = CollectionStory.bind({})
LoggedIn.args = CollectionLoggedInStoryProps

export const Owner = CollectionStory.bind({})
Owner.args = CollectionOwnerStoryProps

export default meta
