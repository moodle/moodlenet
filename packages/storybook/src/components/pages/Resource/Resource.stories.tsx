import { ResourceFormValues } from '@moodlenet/resource/common'
import { Resource, ResourceProps } from '@moodlenet/resource/ui'
import { action } from '@storybook/addon-actions'
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
  excludeStories: [
    'ResourceLoggedOutStoryProps',
    'ResourceLoggedInStoryProps',
    'ResourceOwnerStoryProps',
    'ResourceActivatedStoryProps',
    'ResourceAdminStoryProps',
    'ResourceApprovedStoryProps',
    'NewResourceProps',
  ],
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

export const Owner: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      isPublished: true,
    },
    state: {
      isSaving: false,
      isSaved: true,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps: Partial<ResourceFormValues> = {
  name: '',
  description: '',
  content: null,
  image: null,
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      downloadFilename: undefined,
      numLikes: 0,
      specificContentType: '',
      isPublished: true,
      isWaitingForApproval: false,
    },
    resourceForm: NewResourceProps,
    state: {
      isSaving: false,
      isSaved: true,
    },
    actions: {
      setIsPublished: action('set is published'),
    },
    access: {
      isCreator: true,
      canEdit: true,
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
    },
  })
  return <Resource {...props} />
}

export default meta
