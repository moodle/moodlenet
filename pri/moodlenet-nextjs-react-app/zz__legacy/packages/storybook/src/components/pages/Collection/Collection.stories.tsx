import type { CollectionFormProps } from '@moodlenet/collection/common'
import { Collection } from '@moodlenet/collection/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useCollectionStoryProps } from './CollectionProps.stories'
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

export const New: CollectionStory = () => {
  const props = useCollectionStoryProps({
    mainColumnItems: [],
    data: {
      mnUrl: 'moodle.com',
      image: null,
    },
    collectionForm: NewCollectionProps,
    state: {
      isPublished: false,
    },
    actions: {},
    access: {
      canDelete: true,
      canPublish: true,

      isCreator: true,
      canEdit: true,
    },
    resourceCardPropsList: [],
  })

  return <Collection {...props} />
}

export const Creator: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {
      // imageUrl:
      //   'https://images.unsplash.com/photo-1575699914911-0027c7b95fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHwxfHxrYW5nYXJvb3xlbnwwfDB8fHwxNjU3MjYxMzYy&ixlib=rb-1.2.1&q=80&w=1080',
    },
    state: {
      isPublished: true,
    },
    actions: {},
    access: {
      canDelete: true,
      canPublish: true,
      isCreator: true,
      canEdit: true,
    },
    //isSaving: false,
    // resourceCardPropsList: [],
  })
  // const [resourceCardPropsList, setResourceCardPropsList] = useState(props.resourceCardPropsList)

  // resourceCardPropsList.map(r => {
  //   r.onRemoveClick = () => {
  //     action('onRemoveResourceClick')
  //     setResourceCardPropsList(resourceCardPropsList.filter(x => x !== r))
  //   }
  // })

  return <Collection {...props} resourceCardPropsList={props.resourceCardPropsList} />
}

export const NewCollectionProps: CollectionFormProps = {
  title: '',
  description: '',
  // visibility: 'Private',
}

export const Admin: CollectionStory = () => {
  const props = useCollectionStoryProps({
    data: {
      // image:
      // 'https://images.unsplash.com/photo-1575699914911-0027c7b95fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDQ5NjR8MHwxfHNlYXJjaHwxfHxrYW5nYXJvb3xlbnwwfDB8fHwxNjU3MjYxMzYy&ixlib=rb-1.2.1&q=80&w=1080',
    },
    state: {
      isPublished: true,
    },
    actions: {},
    access: {
      canDelete: true,
      canPublish: true,
      canEdit: true,
    },
  })

  return <Collection {...props} />
}

export default meta
