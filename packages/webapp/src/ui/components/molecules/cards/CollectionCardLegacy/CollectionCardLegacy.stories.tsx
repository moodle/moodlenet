import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
import { href } from '../../../../elements/link'
import {
  CollectionCardLegacy,
  CollectionCardLegacyProps,
} from './CollectionCardLegacy'

const meta: ComponentMeta<typeof CollectionCardLegacy> = {
  title: 'Molecules/CollectionCardLegacy',
  component: CollectionCardLegacy,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'CollectionCardLegacyStoryProps',
    'CollectionCardLegacyLoggedInStoryProps',
    'CollectionCardLegacyLoggedOutStoryProps',
    'CollectionCardLegacyFollowingStoryProps',
    'CollectionCardLegacyBookmarkedStoryProps',
    'CollectionCardLegacyOwnerStoryProps',
    'CollectionCardLegacyOwnerPrivateStoryProps',
  ],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionCardLegacyStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return {
    title: 'Best collection ever created '.split(' ').slice(0, i).join(' '),
    imageUrl: 'https://picsum.photos/200/100',
    collectionHref: href('Pages/Collection/LoggedIn'),
    bookmarked: false,
    following: false,
    numFollowers: 32,
    isAuthenticated: true,
    isOwner: false,
    visibility: 'Public',
    toggleFollow: linkTo('Molecules/CollectionCardLegacy', 'Following'),
    toggleBookmark: linkTo('Molecules/CollectionCardLegacy', 'Bookmarked'),
  }
}

export const CollectionCardLegacyLoggedInStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return { ...CollectionCardLegacyStoryProps(i) }
}

export const CollectionCardLegacyFollowingStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return {
    ...CollectionCardLegacyLoggedInStoryProps(i),
    following: true,
    toggleFollow: linkTo('Molecules/CollectionCardLegacy', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardLegacyBookmarkedStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return {
    ...CollectionCardLegacyLoggedInStoryProps(i),
    bookmarked: true,
    toggleBookmark: linkTo('Molecules/CollectionCardLegacy', 'LoggedIn'), // Strangely not working}
  }
}

export const CollectionCardLegacyLoggedOutStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return {
    ...CollectionCardLegacyStoryProps(i),
    collectionHref: href('Pages/Collection/LoggedOut'),
    isAuthenticated: false,
  }
}

export const CollectionCardLegacyOwnerStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return {
    ...CollectionCardLegacyLoggedInStoryProps(i),
    collectionHref: href('Pages/Collection/Owner'),
    isOwner: true,
    visibility: 'Public',
  }
}

export const CollectionCardLegacyOwnerPrivateStoryProps = (
  i: number
): CollectionCardLegacyProps => {
  return { ...CollectionCardLegacyOwnerStoryProps(i), visibility: 'Private' }
}

const CollectionCardLegacyStory: ComponentStory<typeof CollectionCardLegacy> = (
  args
) => <CollectionCardLegacy {...args} />

const i = randomIntFromInterval(1, 3)

export const LoggedIn = CollectionCardLegacyStory.bind({})
LoggedIn.args = CollectionCardLegacyLoggedInStoryProps(i)

export const Following = CollectionCardLegacyStory.bind({})
Following.args = CollectionCardLegacyFollowingStoryProps(i)

export const Bookmarked = CollectionCardLegacyStory.bind({})
Bookmarked.args = CollectionCardLegacyBookmarkedStoryProps(i)

export const LoggedOut = CollectionCardLegacyStory.bind({})
LoggedOut.args = CollectionCardLegacyLoggedOutStoryProps(i)

export const Owner = CollectionCardLegacyStory.bind({})
Owner.args = CollectionCardLegacyOwnerStoryProps(i)

export const Public = CollectionCardLegacyStory.bind({})
Public.args = CollectionCardLegacyOwnerStoryProps(i)

export const Private = CollectionCardLegacyStory.bind({})
Private.args = CollectionCardLegacyOwnerPrivateStoryProps(i)

export default meta
