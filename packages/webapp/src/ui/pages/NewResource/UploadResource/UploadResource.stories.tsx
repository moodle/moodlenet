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
    (Story)=>(<div style={{maxWidth:500}}><Story/></div>)
  ]
}

export const UploadResourceStoryProps: UploadResourceProps = {
  backgroundUrl: 'https://picsum.photos/200/100',
  username: 'juanito',
  avatarUrl: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  firstName: 'Juanito',
  lastName: 'Rodriguez',
  organizationName: 'UM',
  location: 'Malta',
  siteUrl: 'https://iuri.is/',
  description: 'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.'
}

const UploadResourceStory: ComponentStory<typeof UploadResource> = args => <UploadResource {...args} />

export const Default = UploadResourceStory.bind({})
Default.args = UploadResourceStoryProps

export default meta
