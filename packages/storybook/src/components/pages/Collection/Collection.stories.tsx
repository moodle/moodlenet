import { CollectionFormProps } from '@moodlenet/collection/common'
import { Collection } from '@moodlenet/collection/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useCollectionStoryProps } from './stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'CollectionLoggedOutStoryProps',
    'CollectionLoggedInStoryProps',
    'CollectionCreatorStoryProps',
    'CollectionActivatedStoryProps',
    'CollectionAdminStoryProps',
    'CollectionApprovedStoryProps',
    'NewCollectionProps',
  ],
}

type CollectionStory = ComponentStory<typeof Collection>

export const LoggedOut: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {},
    state: {},
    actions: {},
    access: {},
    isAuthenticated: false,
  })

  return <Collection {...props} />
}

export const LoggedIn: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {},
    state: {
      // bookmarked: true,
      // followed: true,
    },
    actions: {},
    access: {},
  })

  return <Collection {...props} />
}

export const Creator: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {
      imageUrl:
        'https://images.unsplash.com/photo-1575699914911-0027c7b95fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHwxfHxrYW5nYXJvb3xlbnwwfDB8fHwxNjU3MjYxMzYy&ixlib=rb-1.2.1&q=80&w=1080',
    },
    state: {
      isPublished: false,
      // bookmarked: true,
      // isSaving: true,
    },
    actions: {},
    access: {
      canDelete: true,
      canPublish: true,
      isCreator: true,
      canEdit: true,
    },
    isSaving: false,
  })

  return <Collection {...props} />
}

export const NewCollectionProps: CollectionFormProps = {
  title: '',
  description: '',
  // visibility: 'Private',
}

export const New: CollectionStory = () => {
  const props = useCollectionStoryProps({
    mainColumnItems: [],
    data: {
      mnUrl: 'moodle.com',
      isWaitingForApproval: false,
      imageUrl: undefined,
    },
    collectionForm: NewCollectionProps,
    state: {
      isPublished: false,
      // bookmarked: true,
      // followed: true,
    },
    actions: {},
    access: {
      canDelete: true,
      canPublish: true,

      isCreator: true,
      canEdit: true,
    },
  })

  return <Collection {...props} />
}

export const Admin: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {},
    state: {},
    actions: {},
    access: {
      canEdit: true,
      canPublish: true,
      canDelete: true,
    },
  })
  return <Collection {...props} />
}

export default meta
