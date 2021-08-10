import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ResourceActionsCard, ResourceActionsCardProps } from './ResourceActionsCard'

const meta: ComponentMeta<typeof ResourceActionsCard> = {
  title: 'Pages/Resource/ResourceActionsCard',
  component: ResourceActionsCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ResourceActionsCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const ResourceActionsCardStoryProps: ResourceActionsCardProps = {
  tags: ["Reforestationg", "Drones", "Soil"],
  title: 'My Best Resource',
  type: 'Video'
}

const ResourceActionsCardStory: ComponentStory<typeof ResourceActionsCard> = args => <ResourceActionsCard {...args} />

export const Default = ResourceActionsCardStory.bind({})
Default.args = ResourceActionsCardStoryProps

export default meta
