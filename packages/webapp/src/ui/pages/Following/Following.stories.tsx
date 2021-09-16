import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '../../components/Browser/Browser.stories'
import { HeaderPageLoggedInStoryProps, HeaderPageLoggedOutStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Following, FollowingProps } from './Following'

const meta: ComponentMeta<typeof Following> = {
  title: 'Pages/Following',
  component: Following,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['FollowingStoryProps', 'FollowingLoggedOutStoryProps', 'FollowingLoggedInStoryProps'],
}

const FollowingStory: ComponentStory<typeof Following> = args => <Following {...args} />

export const FollowingStoryProps: FollowingProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  browserProps: {
    ...BrowserLoggedInStoryProps,
    resourceCardPropsList: null,
    setSortBy: null,
  },
}

export const FollowingLoggedInStoryProps: FollowingProps = {
  ...FollowingStoryProps,
}

export const FollowingLoggedOutStoryProps: FollowingProps = {
  ...FollowingStoryProps,
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
  },
  browserProps: {
    ...BrowserLoggedOutStoryProps,
    resourceCardPropsList: null,
    setSortBy: null,
  },
}

export const LoggedIn = FollowingStory.bind({})
LoggedIn.args = FollowingLoggedInStoryProps

export const LoggedOut = FollowingStory.bind({})
LoggedOut.args = FollowingLoggedOutStoryProps

export default meta
