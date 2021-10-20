import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { CollectionCardStoryProps } from '../../molecules/cards/CollectionCard/CollectionCard.stories'
import { ResourceCardStoryProps } from '../../molecules/cards/ResourceCard/ResourceCard.stories'
import { HeaderPageLoggedInStoryProps, HeaderPageLoggedOutStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Category, CategoryProps } from './Category'

const meta: ComponentMeta<typeof Category> = {
  title: 'Pages/Subject',
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
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  isAuthenticated: true,
  title: 'Environment',
  following: false,
  numFollowers: 2387,
  numCollections: 43,
  numResources: 165,
  iscedLink: 'http://uis.unesco.org/en/topic/international-standard-classification-education-isced',
  isIscedSubject: true,
  collectionCardPropsList: [
    CollectionCardStoryProps,
    CollectionCardStoryProps,
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
    ResourceCardStoryProps,
  ],
  toggleFollow: action('toggleFollow'),
}

export const CategoryLoggedOutStoryProps: CategoryProps = {
  ...CategoryStoryProps,
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
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
