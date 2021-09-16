import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '../../components/Browser/Browser.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Search, SearchProps } from './Search'

const meta: ComponentMeta<typeof Search> = {
  title: 'Pages/Search',
  component: Search,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['SearchStoryProps', 'SearchLoggedOutStoryProps', 'SearchLoggedInStoryProps'],
}

const SearchStory: ComponentStory<typeof Search> = args => <Search {...args} />

export const SearchStoryProps: SearchProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  browserProps: BrowserLoggedInStoryProps,
}

export const SearchLoggedOutStoryProps: SearchProps = {
  ...SearchStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      isAuthenticated: false,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: { tags: [] },
    },
  }, 
  browserProps: BrowserLoggedOutStoryProps,
}

export const SearchLoggedInStoryProps: SearchProps = {
  ...SearchStoryProps,
}

export const LoggedOut = SearchStory.bind({})
LoggedOut.args = SearchLoggedOutStoryProps

export const LoggedIn = SearchStory.bind({})
LoggedIn.args = SearchLoggedInStoryProps

export default meta
