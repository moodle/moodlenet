import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCardStoryProps } from '../../components/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderPageLoggedInStoryProps, HeaderPageLoggedOutStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Category, CategoryProps } from './Category'

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
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps,
    CollectionCardStoryProps
  ],
  resourceCardPropsList: [
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
    ResourceCardStoryProps,
  ],
  toggleFollow: action('toggleFollow'),
}

export const CategoryLoggedOutStoryProps: CategoryProps = {
  ...CategoryStoryProps,
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
  },
  isAuthenticated: true,
  
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
