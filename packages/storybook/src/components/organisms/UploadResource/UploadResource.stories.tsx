import { UploadResource, UploadResourceProps } from '@moodlenet/resource/ui'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const meta: ComponentMeta<typeof UploadResource> = {
  title: 'Organisms/UploadResource',
  component: UploadResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['UploadResourceStoryProps'],
}

export const UploadResourceStoryProps = (
  props?: Partial<UploadResourceProps>,
): UploadResourceProps => {
  return {
    fileMaxSize: 50 * 1024 * 1024,
    resource: {
      content: '',
      name: '',
      description: '',
      category: '',
      visibility: 'Private',
      isFile: false,
    },
    editResource: async () => action('editing resource submited'),
    ...props,
  }
}

type UploadResourceStory = ComponentStory<typeof UploadResource>

export const Default: UploadResourceStory = () => {
  const props = {
    ...UploadResourceStoryProps(),
  }
  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <UploadResource {...props} />
    </div>
  )
}

export default meta
