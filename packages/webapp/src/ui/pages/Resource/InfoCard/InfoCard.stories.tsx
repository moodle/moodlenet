import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InfoCard, InfoCardProps } from './InfoCard'

const meta: ComponentMeta<typeof InfoCard> = {
  title: 'Pages/Resource/InfoCard',
  component: InfoCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['InfoCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const InfoCardStoryProps: InfoCardProps = {
  tags: ["Reforestationg", "Drones", "Soil"],
  title: 'My Best Resource',
  type: 'Video'
}

const InfoCardStory: ComponentStory<typeof InfoCard> = args => <InfoCard {...args} />

export const Default = InfoCardStory.bind({})
Default.args = InfoCardStoryProps

export default meta
