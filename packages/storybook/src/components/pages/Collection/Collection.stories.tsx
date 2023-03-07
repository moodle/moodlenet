import { Collection } from '@moodlenet/collection/ui'
import { getResourcesCardStoryProps } from '@moodlenet/resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
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
    resourceCardPropsList: getResourcesCardStoryProps(15, {
      access: {
        isAuthenticated: false,
      },
      orientation: 'horizontal',
    }),
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
    resourceCardPropsList: getResourcesCardStoryProps(15, {
      access: {
        canEdit: true,
        isCreator: true,
      },
      orientation: 'horizontal',
    }),
  })

  return <Collection {...props} />
}

export const NewCollectionProps = {
  content: null,
  name: '',
  description: '',
  category: '',
  type: '',
  image: null,
  // visibility: 'Private',
  isFile: false,
}

export const New: CollectionStory = () => {
  // const [isEditting, setIsEditing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  // const [uploadProgress, setUploadProgress] = useState(0)

  // useEffect(() => {
  //   uploadProgress < 100 && setTimeout(() => setUploadProgress(oldCount => oldCount + 1), 70)
  // }, [uploadProgress])
  // const [isWaitingForApproval, setIsWaitingForApproval] = useState(true)

  // useEffect(() => {
  //   !isPublished && setIsWaitingForApproval(false)
  // }, [isPublished])

  const props = useCollectionStoryProps({
    data: {
      mnUrl: 'moodle.com',
      isPublished,
      isWaitingForApproval: false,
    },
    collectionForm: NewCollectionProps,
    state: {
      bookmarked: true,
      followed: true,
      // isSaving: true,
      isSaving: false,
      // isSaved: true,
    },
    actions: {
      setIsPublished,
    },
    access: {
      isCreator: true,
      canEdit: true,
    },
    resourceCardPropsList: [],
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
