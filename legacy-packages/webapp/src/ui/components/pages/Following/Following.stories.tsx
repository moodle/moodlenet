import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { BrowserFollowingStoryProps } from '../../organisms/Browser/Browser.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Following, FollowingProps } from './Following'

const meta: ComponentMeta<typeof Following> = {
  title: 'Pages/Following',
  component: Following,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['FollowingLoggedInStoryProps'],
}

const FollowingStory: ComponentStory<typeof Following> = (args) => (
  <Following {...args} />
)

export const FollowingLoggedInStoryProps: FollowingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
      cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
    },
  },
  browserProps: {
    ...BrowserFollowingStoryProps,
    resourceCardPropsList: null,
    setSortBy: null,
    title: 'Following',
  },
}

export const Default = FollowingStory.bind({})
Default.args = FollowingLoggedInStoryProps

export default meta
