import type { AddonItem } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import type {
  ResourceCardAccess,
  ResourceCardActions,
  ResourceCardDataProps,
  ResourceCardState,
} from '@moodlenet/ed-resource/common'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { ResourceCard, VisualResourceAlert } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import { ContentBackupImages } from '@moodlenet/react-app/ui'
import type { BookmarkButtonProps, LikeButtonProps } from '@moodlenet/web-user/ui'
import { BookmarkButton, LikeButton } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { PartialDeep } from 'type-fest'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Molecules/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'ResourceCardStoryProps',
    'ResourceCardLoggedOutStoryProps',
    'ResourceCardLoggedInStoryProps',
    'ResourceCardOwnerStoryProps',
    'ResourceCardOwnerBookmarkedStoryProps',
    'ResourceCardOwnerPrivateStoryProps',
    'ResourceCardVerticalLoggedInStoryProps',
    'ResourceCardVerticalLoggedOutStoryProps',
    'getResourceCardStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
}

export const getResourceCardStoryProps = (
  overrides?: PartialDeep<
    ResourceCardProps & {
      isAuthenticated: boolean
      bookmarkButtonProps: BookmarkButtonProps
      likeButtonProps: LikeButtonProps
      showVisualAlert: boolean
    }
  >,
): ResourceCardProps => {
  const id = `${Math.floor(Math.random() * ContentBackupImages.length * 10000000)}`
  const data: ResourceCardDataProps = {
    id: `id-${id}`,
    // tags: TagListStory,
    title: `Why the  ${
      Math.random() < 0.5 ? 'tropical rainforests are' : 'the oceans are'
    } the world's most important ecosystems`,
    contentUrl: 'https://moodle.net/profile/d488bc9d51ef-moodle-academy',
    // contentUrl: 'https://youtu.be/dZNC5kIvM00',
    // contentUrl: 'https://vimeo.com/204467192',
    image: {
      location:
        'https://images.unsplash.com/photo-1442120108414-42e7ea50d0b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1249&q=80',
      credits: null,
    },
    // contentType: 'file',
    contentType: 'link',
    // downloadFilename: 'Rainfores documentary.mp4',
    downloadFilename: 'null',
    resourceHomeHref: href('Pages/Resource/Logged In'),
    // numLikes: 23,
    owner: {
      profileHref: href('Pages/Profile/Logged In'),
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      displayName: 'Karl Phosler',
    },
  }
  const state: ResourceCardState = {
    isPublished: true,
    autofillState: undefined,
    // autofillState: 'ai-generation',
    ...overrides?.state,
  }
  const actions: ResourceCardActions = {
    publish: action('publish resource'),
    unpublish: action('unpublish resource'),
  }

  const access: ResourceCardAccess = {
    isCreator: false,
    canDelete: false,
    canPublish: false,
    ...overrides?.access,
  }

  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const isAuthenticated = overrides?.isAuthenticated ?? true

  const bookmarkButtonProps: BookmarkButtonProps = {
    bookmarked: false,
    canBookmark: true,
    isAuthenticated,
    toggleBookmark: action('toggle bookmark'),
    ...overrides?.bookmarkButtonProps,
  }

  const likeButtonProps: LikeButtonProps = {
    liked: false,
    canLike: true,
    isAuthenticated,
    numLikes: 23,
    isCreator: access.isCreator,
    toggleLike: action('toggle like'),
    ...overrides?.likeButtonProps,
  }

  const visualAlert: AddonItem | null = overrides?.showVisualAlert
    ? {
        Item: () => <VisualResourceAlert />,
        key: 'visual-resource-alert',
      }
    : null

  const slots: Pick<
    ResourceCardProps,
    'bottomLeftItems' | 'bottomRightItems' | 'mainColumnItems' | 'topLeftItems' | 'topRightItems'
  > = {
    topLeftItems: [],
    topRightItems: [],
    mainColumnItems: [visualAlert],
    bottomLeftItems: [],
    bottomRightItems: [
      isPublished
        ? {
            Item: () => <BookmarkButton {...bookmarkButtonProps} />,
            key: 'like-button',
          }
        : null,
      isPublished
        ? {
            Item: () => <LikeButton {...likeButtonProps} />,
            key: 'like-button',
          }
        : null,
    ],
  }

  const newResource = overrideDeep<ResourceCardProps>(
    {
      ...slots,
      data,
      state,
      actions,
      access,
    },
    overrides,
  )
  return overrideDeep<ResourceCardProps>(newResource, {
    data: {
      id: id,
    },
  })
}

export const ResourceCardLoggedInStoryProps: ResourceCardProps = getResourceCardStoryProps()

export const ResourceCardLoggedOutStoryProps: ResourceCardProps = getResourceCardStoryProps({
  access: {},
})

export const ResourceCardOwnerStoryProps: ResourceCardProps = getResourceCardStoryProps({
  access: {
    // isCreator: true,
  },
})

export const ResourceCardOwnerPrivateStoryProps: ResourceCardProps = getResourceCardStoryProps({
  state: {
    isPublished: false,
  },
  access: {
    // isCreator: true,
  },
})

export const ResourceCardOwnerBookmarkedStoryProps: ResourceCardProps = getResourceCardStoryProps({
  ...ResourceCardOwnerStoryProps,
  state: {
    // bookmarked: true,
  },
  access: {},
})

export const ResourceCardVerticalLoggedInStoryProps: ResourceCardProps = getResourceCardStoryProps({
  ...ResourceCardOwnerStoryProps,
  orientation: 'vertical',
  state: {
    // liked: true,
  },
  access: {},
})

export const ResourceCardVerticalLoggedOutStoryProps: ResourceCardProps = getResourceCardStoryProps(
  {
    ...ResourceCardLoggedOutStoryProps,
    orientation: 'vertical',
    state: {},
    access: {},
  },
)

const ResourceCardStory: ComponentStory<typeof ResourceCard> = args => <ResourceCard {...args} />

export const LoggedIn: typeof ResourceCardStory = ResourceCardStory.bind({})
LoggedIn.args = ResourceCardLoggedInStoryProps

export const LoggedOut: typeof ResourceCardStory = ResourceCardStory.bind({})
LoggedOut.args = ResourceCardLoggedOutStoryProps

export const Owner: typeof ResourceCardStory = ResourceCardStory.bind({})
Owner.args = ResourceCardOwnerStoryProps

export const Public: typeof ResourceCardStory = ResourceCardStory.bind({})
Public.args = ResourceCardOwnerStoryProps

export const Private: typeof ResourceCardStory = ResourceCardStory.bind({})
Private.args = ResourceCardOwnerPrivateStoryProps

export const VerticalLoggedIn: typeof ResourceCardStory = ResourceCardStory.bind({})
VerticalLoggedIn.args = ResourceCardVerticalLoggedInStoryProps

export const VerticalLoggedOut: typeof ResourceCardStory = ResourceCardStory.bind({})
VerticalLoggedOut.args = ResourceCardVerticalLoggedOutStoryProps

export const VerticalOwner: typeof ResourceCardStory = ResourceCardStory.bind({})
VerticalOwner.args = { ...ResourceCardOwnerStoryProps, orientation: 'vertical' }

export const VerticalPublic: typeof ResourceCardStory = ResourceCardStory.bind({})
VerticalPublic.args = getResourceCardStoryProps({
  ...ResourceCardOwnerStoryProps,
  orientation: 'vertical',
})

export const VerticalPrivate: typeof ResourceCardStory = ResourceCardStory.bind({})
VerticalPrivate.args = getResourceCardStoryProps({
  ...ResourceCardOwnerPrivateStoryProps,
  orientation: 'vertical',
})

export default meta
