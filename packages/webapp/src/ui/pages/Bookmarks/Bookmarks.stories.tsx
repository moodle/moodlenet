import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BrowserStoryProps } from '../../components/Browser/Browser.stories'
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
  browserProps: {
    ...BrowserStoryProps,
    subjectCardPropsList: null,
    setSortBy: null
  }
}

export const BookmarksLoggedInStoryProps: BookmarksProps = {
  ...BookmarksStoryProps,
}

export const Default = BookmarksStory.bind({})
Default.args = BookmarksStoryProps

export default meta
