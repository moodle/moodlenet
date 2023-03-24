import { CollectionFormValues } from '@moodlenet/collection/common'
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
    'CollectionOwnerStoryProps',
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
    access: {
      isAuthenticated: false,
    },
  })

  return <Collection {...props} />
}

export const LoggedIn: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {},
    state: {
      bookmarked: true,
      followed: true,
    },
    actions: {},
    access: {},
  })

  return <Collection {...props} />
}

export const Owner: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {
      isPublished: false,
    },
    state: {
      bookmarked: true,
      // isSaving: true,
      isSaving: false,
      // isSaved: true,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
    },
  })

  return <Collection {...props} />
}

export const NewCollectionProps: CollectionFormValues = {
  name: '',
  description: '',
  image: null,
  // visibility: 'Private',
}

export const New: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {
      mnUrl: 'moodle.com',
      isWaitingForApproval: false,
    },
    collectionForm: NewCollectionProps,
    state: {
      bookmarked: true,
      followed: true,
      // isSaving: true,
      // isSaving: false,
      // isSaved: true,
    },
    actions: {},
    access: {
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
      isAdmin: true,
      canEdit: true,
    },
  })
  return <Collection {...props} />
}

export default meta
