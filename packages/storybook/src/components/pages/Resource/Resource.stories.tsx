import { ResourceFormProps } from '@moodlenet/ed-resource/common'
import { Resource, ResourceProps } from '@moodlenet/ed-resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
    access: {
      isAuthenticated: false,
    },
  })

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({})
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
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps: Partial<ResourceFormProps> = {
  title: '',
  description: '',
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      downloadFilename: undefined,
      isWaitingForApproval: false,
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
