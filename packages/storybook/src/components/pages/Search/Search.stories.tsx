// import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '@moodlenet/react-app/stories'
import { Search } from '@moodlenet/react-app/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutLoggedInStoryProps } from 'components/layout/MainLayout/MainLayout.stories.js'
import { useBrowserLoggedOutStoryProps } from 'components/organisms/Browser/Browser.stories.js'

const meta: ComponentMeta<typeof Search> = {
  title: 'Pages/Search',
  component: Search,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SearchStoryProps', 'SearchLoggedOutStoryProps', 'SearchLoggedInStoryProps'],
}

type SearchStory = ComponentStory<typeof Search>
// const SearchStory: ComponentStory<typeof Search> = args => <Search {...args} />

export const LoggedOut: SearchStory = () => {
  const props = {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    browserProps: useBrowserLoggedOutStoryProps(),
  }
  return <Search {...props} />
}

// export const SearchStoryProps: SearchProps = {
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

// export const SearchLoggedOutStoryProps: SearchProps = {
//   ...SearchStoryProps,
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

// export const SearchLoggedInStoryProps: SearchProps = {
//   ...SearchStoryProps,
// }

// export const LoggedOut = SearchStory.bind({})
// LoggedOut.args = SearchLoggedOutStoryProps

// export const LoggedIn = SearchStory.bind({})
// LoggedIn.args = SearchLoggedInStoryProps

export default meta
