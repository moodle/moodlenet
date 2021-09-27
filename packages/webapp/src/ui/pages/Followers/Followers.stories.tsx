import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserLoggedInStoryProps } from '../../components/Browser/Browser.stories'
import { href } from '../../elements/link'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Followers, FollowersProps } from './Followers'

const meta: ComponentMeta<typeof Followers> = {
  title: 'Pages/Followers',
  component: Followers,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['FollowersLoggedInStoryProps'],
}

const FollowersStory: ComponentStory<typeof Followers> = args => <Followers {...args} />

export const FollowersLoggedInStoryProps: FollowersProps = {
  displayName: 'Juanito Rodriguez',
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  browserProps: {
    ...BrowserLoggedInStoryProps,
    hideSortAndFilter: true,
    subjectCardPropsList: null,
    collectionCardPropsList: null,
    resourceCardPropsList: null,
  },
}

export const Default = FollowersStory.bind({})
Default.args = FollowersLoggedInStoryProps

export default meta
