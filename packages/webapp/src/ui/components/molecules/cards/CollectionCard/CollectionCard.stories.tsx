import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
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
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionCardStoryProps = (i: number): CollectionCardProps => {
  return {
    title:
      'Best collection ever created Best collection ever created Best collection ever created ',
    imageUrl: 'https://picsum.photos/300/200',
    collectionHref: href('Pages/Collection/LoggedIn'),
    bookmarked: false,
    following: false,
    numFollowers: 32,
    numResource: 5,
    isAuthenticated: true,
    isOwner: false,
    visibility: 'Public',
    toggleFollow: linkTo('Molecules/CollectionCard', 'Following'),
    toggleBookmark: linkTo('Molecules/CollectionCard', 'Bookmarked'),
  }
}

export const CollectionCardLoggedInStoryProps = (
  i: number
): CollectionCardProps => {
  return { ...CollectionCardStoryProps(i) }
}

export const CollectionCardFollowingStoryProps = (
  i: number
): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    following: true,
    toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardBookmarkedStoryProps = (
  i: number
): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    bookmarked: true,
    toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardLoggedOutStoryProps = (
  i: number
): CollectionCardProps => {
  return {
    ...CollectionCardStoryProps(i),
    collectionHref: href('Pages/Collection/LoggedOut'),
    isAuthenticated: false,
  }
}

export const CollectionCardOwnerStoryProps = (
  i: number
): CollectionCardProps => {
  return {
    ...CollectionCardLoggedInStoryProps(i),
    collectionHref: href('Pages/Collection/Owner'),
    isOwner: true,
    visibility: 'Public',
  }
}

export const CollectionCardOwnerPrivateStoryProps = (
  i: number
): CollectionCardProps => {
  return { ...CollectionCardOwnerStoryProps(i), visibility: 'Private' }
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = (args) => (
  <CollectionCard {...args} />
)

const i = randomIntFromInterval(1, 3)

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps(i)

export const Following = CollectionCardStory.bind({})
Following.args = CollectionCardFollowingStoryProps(i)

export const Bookmarked = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps(i)

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps(i)

export const Owner = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps(i)

export const Public = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps(i)

export const Private = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps(i)

export default meta
