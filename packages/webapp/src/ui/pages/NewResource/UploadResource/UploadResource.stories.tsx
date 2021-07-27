import { ComponentMeta, ComponentStory } from '@storybook/react'
import { UploadResource, UploadResourceProps } from './UploadResource'

const meta: ComponentMeta<typeof UploadResource> = {
  title: 'Pages/New Resource/Upload Resource',
  component: UploadResource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['UploadResourceStoryProps'],
  decorators:[
    (Story)=>(<div style={{maxWidth:1100}}><Story/></div>)
  ]
}

export const UploadResourceStoryProps: UploadResourceProps = {
  state: 'Initial',
  type: '',
  imageUrl: 'https://picsum.photos/200/100'
}

const UploadResourceStory: ComponentStory<typeof UploadResource> = args => <UploadResource {...args} />

export const Default = UploadResourceStory.bind({})
Default.args = UploadResourceStoryProps

export default meta
