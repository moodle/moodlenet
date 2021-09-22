import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserLoggedInStoryProps, BrowserLoggedOutStoryProps } from '../../components/Browser/Browser.stories'
import { HeaderPageLoggedInStoryProps, HeaderPageLoggedOutStoryProps } from '../HeaderPage/HeaderPage.stories'
import { Bookmarks, BookmarksProps } from './Bookmarks'

const meta: ComponentMeta<typeof Bookmarks> = {
  title: 'Pages/Bookmarks',
  component: Bookmarks,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['BookmarksLoggedOutStoryProps', 'BookmarksLoggedInStoryProps'],
}

const BookmarksStory: ComponentStory<typeof Bookmarks> = args => <Bookmarks {...args} />

export const BookmarksLoggedInStoryProps: BookmarksProps = {
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedInStoryProps,
    isAuthenticated: true,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  browserProps: {
    ...BrowserLoggedInStoryProps,
    subjectCardPropsList: null,
    smallProfileCardPropsList: null,
    setSortBy: null,
  },
}

export const BookmarksLoggedOutStoryProps: BookmarksProps = {
  ...BookmarksLoggedInStoryProps,
  headerPageTemplateProps: {
    headerPageProps: HeaderPageLoggedOutStoryProps,
    isAuthenticated: false,
    mainPageWrapperProps: {
      userAcceptsPolicies: null,
    },
  },
  browserProps: {
    ...BrowserLoggedOutStoryProps,
    subjectCardPropsList: null,
    smallProfileCardPropsList: null,
    setSortBy: null,
  },
}

export const LoggedIn = BookmarksStory.bind({})
LoggedIn.args = BookmarksLoggedInStoryProps

export const LoggedOut = BookmarksStory.bind({})
LoggedOut.args = BookmarksLoggedOutStoryProps

export default meta
