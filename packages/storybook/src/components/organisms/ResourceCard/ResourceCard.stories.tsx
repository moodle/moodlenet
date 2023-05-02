import { overrideDeep } from '@moodlenet/component-library/common'
import {
  ResourceCardAccess,
  ResourceCardActions,
  ResourceCardDataProps,
  ResourceCardState,
} from '@moodlenet/ed-resource/common'
import { ResourceCard, ResourceCardProps } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import { ContentBackupImages } from '@moodlenet/react-app/ui'
import { BookmarkButton, LikeButton } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PartialDeep } from 'type-fest'

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
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const getResourceCardStoryProps = (
  overrides?: PartialDeep<ResourceCardProps>,
): ResourceCardProps => {
  const id = `${Math.floor(Math.random() * ContentBackupImages.length * 10000000)}`
  const data: ResourceCardDataProps = {
    resourceId: `id-${id}`,
    // tags: TagListStory,
    title: `Why the  ${
      Math.random() < 0.5 ? 'tropical rainforests are' : 'the oceans are'
    } the world's most important ecosystems`,
    contentUrl: 'https://moodle.net/profile/d488bc9d51ef-moodle-academy',
    // contentUrl: 'https://youtu.be/dZNC5kIvM00',
    // contentUrl: 'https://vimeo.com/204467192',
    imageUrl:
      'https://images.unsplash.com/photo-1442120108414-42e7ea50d0b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1249&q=80',
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
    isSelected: false,
    selectionMode: false,
    liked: false,
    numLikes: 12,
    bookmarked: false,
    ...overrides?.state,
  }
  const actions: ResourceCardActions = {
    toggleLike: action('toggle like'),
    publish: action('publish resource'),
    unpublish: action('unpublish resource'),
    toggleBookmark: action('toggle bookmark'),
  }

  const access: ResourceCardAccess = {
    isAuthenticated: true,
    canLike: true,
    isCreator: false,
    canDelete: false,
    canPublish: false,
    canBookmark: true,
    ...overrides?.access,
  }

  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const slots: Pick<
    ResourceCardProps,
    'bottomLeftItems' | 'bottomRightItems' | 'mainColumnItems' | 'topLeftItems' | 'topRightItems'
  > = {
    topLeftItems: [],
    topRightItems: [],
    mainColumnItems: [],
    bottomLeftItems: [],
    bottomRightItems: [
      isPublished
        ? {
            Item: () => (
              <BookmarkButton
                canBookmark={access.canBookmark}
                bookmarked={state.bookmarked}
                isAuthenticated={access.isAuthenticated}
                toggleBookmark={actions.toggleBookmark}
              />
            ),
            key: 'like-button',
          }
        : null,
      isPublished
        ? {
            Item: () => (
              <LikeButton
                canLike={access.canLike}
                liked={state.liked}
                isAuthenticated={access.isAuthenticated}
                isCreator={access.isCreator}
                toggleLike={actions.toggleLike}
                numLikes={state.numLikes}
              />
            ),
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

      onRemoveClick: () => action('remove resource'),
    },
    overrides,
  )
  return overrideDeep<ResourceCardProps>(newResource, {
    data: {
      resourceId: id,
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

export const LoggedIn = ResourceCardStory.bind({})
LoggedIn.args = ResourceCardLoggedInStoryProps

export const LoggedOut = ResourceCardStory.bind({})
LoggedOut.args = ResourceCardLoggedOutStoryProps

export const Owner = ResourceCardStory.bind({})
Owner.args = ResourceCardOwnerStoryProps

export const Public = ResourceCardStory.bind({})
Public.args = ResourceCardOwnerStoryProps

export const Private = ResourceCardStory.bind({})
Private.args = ResourceCardOwnerPrivateStoryProps

export const VerticalLoggedIn = ResourceCardStory.bind({})
VerticalLoggedIn.args = ResourceCardVerticalLoggedInStoryProps

export const VerticalLoggedOut = ResourceCardStory.bind({})
VerticalLoggedOut.args = ResourceCardVerticalLoggedOutStoryProps

export const VerticalOwner = ResourceCardStory.bind({})
VerticalOwner.args = { ...ResourceCardOwnerStoryProps, orientation: 'vertical' }

export const VerticalPublic = ResourceCardStory.bind({})
VerticalPublic.args = getResourceCardStoryProps({
  ...ResourceCardOwnerStoryProps,
  orientation: 'vertical',
})

export const VerticalPrivate = ResourceCardStory.bind({})
VerticalPrivate.args = getResourceCardStoryProps({
  ...ResourceCardOwnerPrivateStoryProps,
  orientation: 'vertical',
})

export default meta
