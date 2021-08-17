import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserStoryProps } from '../../components/Browser/Browser.stories'
import { HeaderLoggedOutStoryProps } from '../../components/Header/Header.stories'
import { HeaderPageLoggedInStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Bookmarks, BookmarksProps } from './Bookmarks'

const meta: ComponentMeta<typeof Bookmarks> = {
  title: 'Pages/Bookmarks',
  component: Bookmarks,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['BookmarksStoryProps', 'BookmarksLoggedOutStoryProps', 'BookmarksLoggedInStoryProps'],
}

const BookmarksStory: ComponentStory<typeof Bookmarks> = args => <Bookmarks {...args} />

export const BookmarksStoryProps: BookmarksProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
  },
  browserProps: BrowserStoryProps
}

export const BookmarksLoggedOutStoryProps: BookmarksProps = {
  ...BookmarksStoryProps,
  headerPageTemplateProps: {
    isAuthenticated: false,
    headerPageProps: {
      isAuthenticated: false,
      headerProps: HeaderLoggedOutStoryProps,
      subHeaderProps: { tags: [] },
    },
  },
}

export const BookmarksLoggedInStoryProps: BookmarksProps = {
  ...BookmarksStoryProps,
}

export const LoggedOut = BookmarksStory.bind({})
LoggedOut.args = BookmarksLoggedOutStoryProps

export const LoggedIn = BookmarksStory.bind({})
LoggedIn.args = BookmarksLoggedInStoryProps

export default meta
