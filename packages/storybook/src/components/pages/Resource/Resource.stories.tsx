import type { ResourceFormProps } from '@moodlenet/ed-resource/common'
import type { ResourceProps } from '@moodlenet/ed-resource/ui'
import { Resource } from '@moodlenet/ed-resource/ui'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { useResourceStoryProps } from './stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['NewResourceProps'],
}

type ResourceStory = ComponentStory<typeof Resource>

export const LoggedOut: ResourceStory = () => {
  const props: ResourceProps = useResourceStoryProps({
    data: {},
    state: {},
    actions: {},
    access: {},
    isAuthenticated: false,
  })

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {},
    state: {},
    actions: {},
    access: {},
    likeButtonProps: {
      liked: true,
    },
    bookmarkButtonProps: {
      bookmarked: true,
    },
  })
  return <Resource {...props} />
}

export const Creator: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {},
    state: {
      isPublished: true,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
      canPublish: true,
      canDelete: true,
    },
    likeButtonProps: {
      liked: false,
    },
    bookmarkButtonProps: {
      bookmarked: false,
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps: Partial<ResourceFormProps> = {
  title: '',
  description: '',
  subject: '',
  license: '',
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      downloadFilename: undefined,
      contentUrl: undefined,
      imageUrl: undefined,
      // numLikes: 0,
    },
    resourceForm: NewResourceProps,

    state: {
      isPublished: false,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
      canPublish: true,
    },
  })
  return <Resource {...props} />
}

export const Admin: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {},
    state: {},
    actions: {},

    access: {
      canEdit: true,
      canPublish: true,
    },
  })
  return <Resource {...props} />
}

export default meta
