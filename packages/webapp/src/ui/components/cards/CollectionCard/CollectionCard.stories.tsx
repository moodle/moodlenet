import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { CollectionCard, CollectionCardProps } from './CollectionCard'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Components/Cards/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'CollectionCardStoryProps',
    'CollectionCardLoggedInStoryProps',
    'CollectionCardLoggedOutStoryProps',
    'CollectionCardFollowingStoryProps',
    'CollectionCardBookmarkedStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionCardStoryProps: CollectionCardProps = {
  title: 'Best Collection Ever',
  imageUrl: 'https://picsum.photos/200/100',
  collectionHref: href('Pages/Collection/LoggedIn'),
  bookmarked: false,
  following: false,
  numFollowers: 32,
  isAuthenticated: true,
  toggleFollow: linkTo('Components/Cards/CollectionCard', 'Following'),
  toggleBookmark: linkTo('Components/Cards/CollectionCard', 'Bookmarked'),
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps,
}

export const CollectionCardFollowingStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  following: true,
  toggleFollow: linkTo('Components/Cards/CollectionCard', 'LoggedIn'), // Strangely not working
}

export const CollectionCardBookmarkedStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  bookmarked: true,
  toggleBookmark: linkTo('Components/Cards/CollectionCard', 'LoggedIn'), // Strangely not working
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps,
  isAuthenticated: false,
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => <CollectionCard {...args} />

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps

export const Following = CollectionCardStory.bind({})
Following.args = CollectionCardFollowingStoryProps

export const Bookmarked = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps

export default meta
