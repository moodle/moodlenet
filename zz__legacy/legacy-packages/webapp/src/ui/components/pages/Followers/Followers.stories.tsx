import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { BrowserLoggedInStoryProps } from '../../organisms/Browser/Browser.stories'
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

const FollowersStory: ComponentStory<typeof Followers> = (args) => (
  <Followers {...args} />
)

export const FollowersLoggedInStoryProps: FollowersProps = {
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
