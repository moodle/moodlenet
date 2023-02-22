import { randomIntFromInterval } from '@moodlenet/component-library'
import { ContentBackupImages, href } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCard, CollectionCardProps } from './CollectionCard.js'

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
    'CollectionCardfollowedStoryProps',
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

export const getCollectionCardStoryProps = (
  i = 1 | 0,
  overrides?: Partial<CollectionCardProps>,
): CollectionCardProps => {
  return {
    collectionId: `${Math.floor(Math.random() * ContentBackupImages.length)}`,
    title: 'Best collection ever created Best collection ever created Best collection ever created',
    imageUrl: i === 0 ? 'https://picsum.photos/300/200' : null,
    collectionHref: href('Pages/Collection/Logged In'),
    bookmarked: false,
    followed: false,
    numFollowers: 32,
    numResource: 5,
    isAuthenticated: true,
    isOwner: false,
    isPublished: true,
    canEdit: false,
    publish: action('publish resource'),
    setIsPublished: action('set is published'),
    toggleFollow: linkTo('Molecules/CollectionCard', 'followed'),
    toggleBookmark: linkTo('Molecules/CollectionCard', 'Bookmarked'),
    ...overrides,
  }
}

export const CollectionCardLoggedInStoryProps = (i: 1 | 0): CollectionCardProps => {
  return { ...getCollectionCardStoryProps(i) }
}

export const CollectionCardfollowedStoryProps = (i: 0 | 1): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    followed: true,
    toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardBookmarkedStoryProps = (i: 1 | 0): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    bookmarked: true,
    toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardLoggedOutStoryProps = (i: 1 | 0): CollectionCardProps => {
  return {
    ...getCollectionCardStoryProps(i),
    collectionHref: href('Pages/Collection/Logged Out'),
    isAuthenticated: false,
  }
}

export const CollectionCardOwnerStoryProps = (i: 1 | 0): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    collectionHref: href('Pages/Collection/Owner'),
    isOwner: true,
    followed: true,
    isPublished: true,
  }
}

export const CollectionCardOwnerPrivateStoryProps = (i: 1 | 0): CollectionCardProps => {
  return { ...CollectionCardOwnerStoryProps(i), isPublished: false }
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => (
  <CollectionCard {...args} />
)

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const followed = CollectionCardStory.bind({})
followed.args = CollectionCardfollowedStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const Bookmarked = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const Owner = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const Public = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export const Private = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1)

export default meta
