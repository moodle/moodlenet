import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TrendCard, TrendCardProps } from './TrendCard'
const meta: ComponentMeta<typeof TrendCard> = {
  title: 'Components/TrendCard',
  component: TrendCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['TrendCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:500}}><Story/></div>)
  ]
}


const TrendCardStory: ComponentStory<typeof TrendCard> = args => <TrendCard {...args} />

export const TrendCardStoryProps: TrendCardProps = {
  tags: [
    {
        "type": "General",
        "name": "#Agroforestry"
    },
    {
        "type": "General",
        "name": "#Biology"
    },
    {
        "type": "Specific",
        "name": "Desertification"
    },
    {
        "type": "Specific",
        "name": "Rainforest"
    },
    {
        "type": "Specific",
        "name": "Monitoring"
    },
    {
        "type": "General",
        "name": "#Reforestation"
    },
    {
        "type": "Specific",
        "name": "Brazilian Politics"
    },
    {
        "type": "Specific",
        "name": "Reserves"
    },
    {
        "type": "Specific",
        "name": "Indigenous People"
    },
    {
        "type": "General",
        "name": "#Climate Change"
    },
    {
        "type": "General",
        "name": "#Ecology"
    },
    {
        "type": "Specific",
        "name": "Silviculture"
    },
    {
        "type": "General",
        "name": "#Botanic"
    }
  ]
}

export const Default = TrendCardStory.bind({})
Default.args = TrendCardStoryProps

export default meta
