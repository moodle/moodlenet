import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SubHeader, SubHeaderProps } from './SubHeader'

const meta: ComponentMeta<typeof SubHeader> = {
  title: 'Components/Headers/SubHeader',
  component: SubHeader,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SubHeaderStoryProps'],
  decorators:[
    (Story)=>(<div style={{position: 'relative', top:-60}}><Story/></div>)
  ]
}

export const SubHeaderStoryProps: SubHeaderProps = {
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

const SubHeaderStory: ComponentStory<typeof SubHeader> = args => <SubHeader {...args} />

export const Default = SubHeaderStory.bind({})
Default.args = SubHeaderStoryProps
Default.parameters = {layout: 'fullscreen'}

export default meta
