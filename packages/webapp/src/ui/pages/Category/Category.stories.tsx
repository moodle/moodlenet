import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Category, CategoryProps } from './Category'
import { CategoryOverallCardStoryProps } from './CategoryOverallCard/CategoryOverallCard.stories'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'

const meta: ComponentMeta<typeof Category> = {
  title: 'Pages/Category',
  component: Category,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['CategoryStoryProps', 'CategoryLoggedOutStoryProps', 'CategoryLoggedInStoryProps'],
}

const CategoryStory: ComponentStory<typeof Category> = args => <Category {...args} />

export const CategoryStoryProps: CategoryProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  isAuthenticated: true,
  title: 'Environment',
  following: false,
  numFollowers: 2387,
  numCollections: 43,
  numResources: 165,
  contributorCardProps: ContributorCardStoryProps,
  categoryOverallCard: CategoryOverallCardStoryProps,
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
  ],
  resourceCardPropsList: [
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps
  ],
  updateCategory: action('updateCategory'),
}

export const CategoryLoggedOutStoryProps: CategoryProps = {
  ...CategoryStoryProps,
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

export const CategoryLoggedInStoryProps: CategoryProps = {
  ...CategoryStoryProps,
  headerPageTemplateProps: {
    ...CategoryStoryProps.headerPageTemplateProps,
    isAuthenticated: true,
  },
}

export const LoggedOut = CategoryStory.bind({})
LoggedOut.args = CategoryLoggedOutStoryProps

export const LoggedIn = CategoryStory.bind({})
LoggedIn.args = CategoryLoggedInStoryProps

export default meta
