import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ResourceCard, ResourceCardProps } from './ResourceCard'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Components/Cards/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ResourceCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const ResourceCardStoryProps: ResourceCardProps = {
  tags: ["Reforestationg", "Drones", "Soil"],
  title: 'Latest Resources',
  image: 'https://picsum.photos/200/100',
  type: 'Video'
}

const ResourceCardStory: ComponentStory<typeof ResourceCard> = args => <ResourceCard {...args} />

export const Default = ResourceCardStory.bind({})
Default.args = ResourceCardStoryProps

export default meta
