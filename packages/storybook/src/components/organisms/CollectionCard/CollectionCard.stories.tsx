import type {
  CollectionCardAccess,
  CollectionCardActions,
  CollectionCardData,
  CollectionCardState,
} from '@moodlenet/collection/common'
import type { CollectionCardProps } from '@moodlenet/collection/ui'
import { CollectionCard } from '@moodlenet/collection/ui'
import { ContentBackupImages } from '@moodlenet/component-library'
import type { AssetInfo } from '@moodlenet/component-library/common'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import type { BookmarkButtonProps, SmallFollowButtonProps } from '@moodlenet/web-user/ui'
import { BookmarkButton, SmallFollowButton } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { PartialDeep } from 'type-fest'

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
  overrides?: PartialDeep<
    CollectionCardProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      smallFollowButtonProps: SmallFollowButtonProps
    }
  > & { data?: { image?: AssetInfo | null } },
): CollectionCardProps => {
  const data: CollectionCardData = {
    id: `id-${Math.floor(Math.random() * ContentBackupImages.length)}`,
    title: 'Such a great collection',
    image: { location: 'https://picsum.photos/300/200', credits: null },
    ...overrides?.data,
    collectionHref: href('Pages/Collection/Logged In'),
  }

  const state: CollectionCardState = {
    numResources: 5,
    isPublished: true,
    // numFollowers: 32,
    // followed: false,
    // bookmarked: false,
    ...overrides?.state,
  }

  const actions: CollectionCardActions = {
    publish: action('publish resource'),
    unpublish: action('unpublish resource'),
    // toggleFollow: linkTo('Molecules/CollectionCard', 'Default'),
    // toggleBookmark: linkTo('Molecules/CollectionCard', 'Default'),
  }

  const access: CollectionCardAccess = {
    isCreator: false,
    canPublish: true,
    // canFollow: true,
    // canBookmark: true,
    // isAuthenticated: true,
    ...overrides?.access,
  }

  const isAuthenticated = overrides?.isAuthenticated ?? true

  const bookmarkButtonProps: BookmarkButtonProps = {
    bookmarked: false,
    canBookmark: true,
    isAuthenticated,
    toggleBookmark: action('toggle bookmark'),
    color: 'white',
    ...overrides?.bookmarkButtonProps,
  }

  const smallFollowButtonProps: SmallFollowButtonProps = {
    canFollow: true,
    isAuthenticated,
    isCreator: access.isCreator,
    toggleFollow: action('toggle follow'),
    followed: false,
    numFollowers: 32,
    ...overrides?.smallFollowButtonProps,
  }

  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const slots: Pick<CollectionCardProps, 'mainColumnItems' | 'topLeftItems' | 'topRightItems'> = {
    topLeftItems: [],
    topRightItems: [
      isPublished
        ? {
            Item: () => <BookmarkButton {...bookmarkButtonProps} />,
            key: 'like-button',
          }
        : null,
      isPublished
        ? {
            Item: () => <SmallFollowButton {...smallFollowButtonProps} />,
            key: 'follow-button',
          }
        : null,
    ],
    mainColumnItems: [],
  }

  return overrideDeep<CollectionCardProps>(
    {
      ...slots,
      data: data,
      state: state,
      actions: actions,
      access: access,
    },
    overrides,
  )
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps(),
}

export const CollectionCardfollowedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      // followed: true,
    },
    actions: {
      // toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardBookmarkedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      // bookmarked: true,
    },
    actions: {
      // toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Logged Out'),
    },
    state: {},
    actions: {},
    access: {},
  }),
}

export const CollectionCardOwnerStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Owner'),
    },
    state: {
      isPublished: true,
      // followed: true,
    },
    actions: {},
    access: {
      isCreator: true,
    },
  }),
}

export const CollectionCardOwnerPrivateStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardOwnerStoryProps,
    data: {},
    state: {
      isPublished: false,
    },
    actions: {},
    access: {},
  }),
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => (
  <CollectionCard {...args} />
)

export const LoggedIn: typeof CollectionCardStory = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps

export const followed: typeof CollectionCardStory = CollectionCardStory.bind({})
followed.args = CollectionCardfollowedStoryProps

export const Bookmarked: typeof CollectionCardStory = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps

export const LoggedOut: typeof CollectionCardStory = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps

export const Owner: typeof CollectionCardStory = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps

export const Public: typeof CollectionCardStory = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps

export const Private: typeof CollectionCardStory = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps

export default meta
