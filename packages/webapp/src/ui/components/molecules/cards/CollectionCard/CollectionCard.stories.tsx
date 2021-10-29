import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { CollectionCard, CollectionCardProps } from './CollectionCard'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Molecules/CollectionCard',
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
    'CollectionCardOwnerStoryProps',
    'CollectionCardOwnerPrivateStoryProps',
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
  title: 'Best collection ever',
  imageUrl: 'https://picsum.photos/200/100',
  collectionHref: href('Pages/Collection/LoggedIn'),
  bookmarked: false,
  following: false,
  numFollowers: 32,
  isAuthenticated: true,
  isOwner: false,
  visibility: 'Public',
  toggleFollow: linkTo('Molecules/CollectionCard', 'Following'),
  toggleBookmark: linkTo('Molecules/CollectionCard', 'Bookmarked'),
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps,
}

export const CollectionCardFollowingStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  following: true,
  toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working
}

export const CollectionCardBookmarkedStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  bookmarked: true,
  toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps,
  collectionHref: href('Pages/Collection/LoggedOut'),
  isAuthenticated: false,
}

export const CollectionCardOwnerStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  collectionHref: href('Pages/Collection/Owner'),
  isOwner: true,
  visibility: 'Public',
}

export const CollectionCardOwnerPrivateStoryProps: CollectionCardProps = {
  ...CollectionCardOwnerStoryProps,
  visibility: 'Private',
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

export const Owner = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps

export const Public = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps

export const Private = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps

export default meta
