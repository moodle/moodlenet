// import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '@moodlenet/react-app/stories'
import type { FollowersProps } from '@moodlenet/web-user/ui'
import { Followers } from '@moodlenet/web-user/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../../components/layout/MainLayout/MainLayout.stories'
import {
  useBrowserProfileList,
  useBrowserStoryProps,
} from '../../../components/organisms/Browser/BrowserProps.stories.props'

const meta: ComponentMeta<typeof Followers> = {
  title: 'Pages/Followers',
  component: Followers,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'FollowersStoryProps',
    'FollowersLoggedOutStoryProps',
    'FollowersLoggedInStoryProps',
  ],
}

type FollowersStory = ComponentStory<typeof Followers>
// const FollowersStory: ComponentStory<typeof Followers> = args => <Followers {...args} />

export const LoggedIn: FollowersStory = () => {
  const props: FollowersProps = {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    browserProps: useBrowserStoryProps({
      mainColumnItems: [useBrowserProfileList(false)],
    }),
    profileName: 'Eduard Stromberg',
    isCreator: false,
  }
  return <Followers {...props} />
}

// export const FollowersStoryProps: FollowersProps = {
//   mainLayoutProps: MainLayoutLoggedInStoryProps,

//   // headerPageTemplateProps: {
//   //   headerPageProps: HeaderPageLoggedInStoryProps,
//   //   isAuthenticated: true,
//   //   mainPageWrapperProps: {
//   //     userAcceptsPolicies: null,
//   //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
//   //   },
//   // },
//   browserProps: BrowserLoggedInStoryProps
// }

// export const FollowersLoggedOutStoryProps: FollowersProps = {
//   ...FollowersStoryProps,
//   mainLayoutProps: MainLayoutLoggedOutStoryProps,
//   // headerPageTemplateProps: {
//   //   isAuthenticated: false,
//   //   headerPageProps: {
//   //     // isAuthenticated: false,
//   //     headerProps: HeaderLoggedOutStoryProps,
//   //     // subHeaderProps: { tags: [] },
//   //   },
//   //   mainPageWrapperProps: {
//   //     userAcceptsPolicies: null,
//   //     cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
//   //   },
//   // },
//   browserProps: BrowserLoggedOutStoryProps,
// }

// export const FollowersLoggedInStoryProps: FollowersProps = {
//   ...FollowersStoryProps,
// }

// export const LoggedOut: typeof FollowersStory = FollowersStory.bind({})
// LoggedOut.args = FollowersLoggedOutStoryProps

// export const LoggedIn: typeof FollowersStory = FollowersStory.bind({})
// LoggedIn.args = FollowersLoggedInStoryProps

export default meta
