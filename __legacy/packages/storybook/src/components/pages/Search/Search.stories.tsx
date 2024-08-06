// import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '@moodlenet/react-app/stories'
import { Search } from '@moodlenet/react-app/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../../components/layout/MainLayout/MainLayout.stories.js'
import { useBrowserStoryProps } from '../../../components/organisms/Browser/BrowserProps.stories.props.js'

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
    mainLayoutProps: MainLayoutLoggedOutStoryProps,
    browserProps: useBrowserStoryProps(),
  }
  return <Search {...props} />
}

export const LoggedIn: SearchStory = () => {
  const props = {
    mainLayoutProps: MainLayoutLoggedInStoryProps,
    browserProps: useBrowserStoryProps(),
  }
  return <Search {...props} />
}

export default meta
