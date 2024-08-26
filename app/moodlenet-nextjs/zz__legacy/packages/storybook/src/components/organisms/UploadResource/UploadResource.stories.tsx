import type { UploadResourceProps } from '@moodlenet/ed-resource/ui'
import { UploadResource } from '@moodlenet/ed-resource/ui'
import { action } from '@storybook/addon-actions'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

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
    //@ts-ignore because it needs to be reviewed
    // @BRU, prop type definition doesn't match
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
