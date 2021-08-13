import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { OverallCardStoryProps } from '../../components/cards/OverallCard/OverallCard.stories'
import { ResourceCardStoryProps } from '../../components/cards/ResourceCard/ResourceCard.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { SubHeaderStoryProps } from '../../components/SubHeader/SubHeader.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Category, CategoryProps } from './Category'
import { ContributorCardStoryProps } from './ContributorCard/ContributorCard.stories'

const meta: ComponentMeta<typeof Category> = {
  title: 'Pages/Category',
  component: Category,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'CategoryStoryProps', 
    'CategoryLoggedOutStoryProps', 
    'CategoryLoggedInStoryProps', 
    'CategoryOwnerStoryProps'
  ],
}

const CategoryStory: ComponentStory<typeof Category> = args => <Category {...args} />

export const CategoryStoryProps: CategoryProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  isAuthenticated: true,
  isOwner: false,
  following: false,
  contributorCardProps: ContributorCardStoryProps,
  overallCardProps: OverallCardStoryProps,
  resourceCardPropsList: [ResourceCardStoryProps, ResourceCardStoryProps, ResourceCardStoryProps],
  updateCategory:action('updateCategory')
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
    isAuthenticated: true,
    headerPageProps: {
      isAuthenticated: true,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: SubHeaderStoryProps,
    },
  },
}

export const CategoryOwnerStoryProps: CategoryProps = {
  ...CategoryLoggedInStoryProps,
  isOwner: true
}

export const LoggedOut = CategoryStory.bind({})
LoggedOut.args = CategoryLoggedOutStoryProps

export const LoggedIn = CategoryStory.bind({})
LoggedIn.args = CategoryLoggedInStoryProps

export const Owner = CategoryStory.bind({})
Owner.args = CategoryOwnerStoryProps

export default meta
