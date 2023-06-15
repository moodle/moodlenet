// import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '@moodlenet/react-app/stories'
import { Following } from '@moodlenet/web-user/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from 'components/layout/MainLayout/MainLayout.stories.js'
import {
  useBrowserCollectionList,
  useBrowserProfileList,
  useBrowserStoryProps,
  useBrowserSubjectList,
} from 'components/organisms/Browser/BrowserProps.stories.js'

const meta: ComponentMeta<typeof Following> = {
  title: 'Pages/Following',
  component: Following,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'FollowingStoryProps',
    'FollowingLoggedOutStoryProps',
    'FollowingLoggedInStoryProps',
  ],
}

type FollowingStory = ComponentStory<typeof Following>
// const FollowingStory: ComponentStory<typeof Following> = args => <Following {...args} />

export const LoggedIn: FollowingStory = () => {
  const props = {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    browserProps: useBrowserStoryProps({
      mainColumnItems: [
        useBrowserSubjectList(),
        useBrowserProfileList(),
        useBrowserCollectionList(),
      ], //@ETTO Following check that on this page you only show the profiles and collection, on that order, with profiles first
    }),
  }
  return <Following {...props} />
}

// export const FollowingStoryProps: FollowingProps = {
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

// export const FollowingLoggedOutStoryProps: FollowingProps = {
//   ...FollowingStoryProps,
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

// export const FollowingLoggedInStoryProps: FollowingProps = {
//   ...FollowingStoryProps,
// }

// export const LoggedOut = FollowingStory.bind({})
// LoggedOut.args = FollowingLoggedOutStoryProps

// export const LoggedIn = FollowingStory.bind({})
// LoggedIn.args = FollowingLoggedInStoryProps

export default meta
