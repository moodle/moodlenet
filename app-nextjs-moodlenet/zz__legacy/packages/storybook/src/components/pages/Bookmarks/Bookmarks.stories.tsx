// import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '@moodlenet/react-app/stories'
import { Bookmarks } from '@moodlenet/web-user/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from '../../../components/layout/MainLayout/MainLayout.stories.js'
import {
  useBrowserCollectionList,
  useBrowserResourceList,
  useBrowserStoryProps,
} from '../../../components/organisms/Browser/BrowserProps.stories.props.js'

const meta: ComponentMeta<typeof Bookmarks> = {
  title: 'Pages/Bookmarks',
  component: Bookmarks,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'BookmarksStoryProps',
    'BookmarksLoggedOutStoryProps',
    'BookmarksLoggedInStoryProps',
  ],
}

type BookmarksStory = ComponentStory<typeof Bookmarks>
// const BookmarksStory: ComponentStory<typeof Bookmarks> = args => <Bookmarks {...args} />

export const LoggedIn: BookmarksStory = () => {
  const props = {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    browserProps: useBrowserStoryProps({
      mainColumnItems: [useBrowserResourceList(), useBrowserCollectionList()],
    }),
  }
  return <Bookmarks {...props} />
}

// export const BookmarksStoryProps: BookmarksProps = {
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

// export const BookmarksLoggedOutStoryProps: BookmarksProps = {
//   ...BookmarksStoryProps,
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

// export const BookmarksLoggedInStoryProps: BookmarksProps = {
//   ...BookmarksStoryProps,
// }

// export const LoggedOut: typeof BookmarksStory = BookmarksStory.bind({})
// LoggedOut.args = BookmarksLoggedOutStoryProps

// export const LoggedIn: typeof BookmarksStory = BookmarksStory.bind({})
// LoggedIn.args = BookmarksLoggedInStoryProps

export default meta
