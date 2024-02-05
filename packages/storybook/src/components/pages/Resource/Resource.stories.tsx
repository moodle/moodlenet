import type { ResourceFormProps } from '@moodlenet/ed-resource/common'
import type { ResourceProps } from '@moodlenet/ed-resource/ui'
import { Resource } from '@moodlenet/ed-resource/ui'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useResourceStoryProps } from './ResourceProps.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['NewResourceProps', 'useResourceForm'],
}

type ResourceStory = ComponentStory<typeof Resource>

export const LoggedOut: ResourceStory = () => {
  const props: ResourceProps = useResourceStoryProps({
    data: {
      contentType: 'link',
      contentUrl: 'https://learngermanwithanja.com/the-german-accusative-case/#t-1632135010328',
    },
    state: {},
    actions: {},
    access: {},
    isAuthenticated: false,
  })

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({
    data: {
      contentType: 'link',
      contentUrl: 'https://learngermanwithanja.com/the-german-accusative-case/#t-1632135010328',
    },
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

export const NewResourceProps: Partial<ResourceFormProps> = {
  title: '',
  description: '',
  subject: '',
  license: '',
  language: '',
  level: '',
  month: '',
  year: '',
  type: '',
  learningOutcomes: [],
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    // data: {
    //   image: null,
    // },
    resourceForm: NewResourceProps,
    startWithoutImage: true,
    state: {
      isPublished: false,
    },
    actions: {},
    access: {
      isCreator: true,
      canEdit: true,
      canPublish: true,
      canDelete: true,
    },
  })
  return <Resource {...props} />
}

export const Creator: ResourceStory = () => {
  const props = useResourceStoryProps({
    saveState: {},
    data: {
      contentType: 'file',
      contentUrl:
        'https://moodle.net/.pkg/@moodlenet/ed-resource/dl/ed-resource/1Vj2B7Mj/557_Sujeto_y_Predicado.pdf',
      downloadFilename: 'Ecosystem_Conservation_Restoration.mbz',
    },
    resourceForm: {
      // level: undefined,
    },
    state: {},
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
