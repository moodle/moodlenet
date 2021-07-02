import { ComponentMeta, ComponentStory } from '@storybook/react'
import { OverallCard, OverallCardProps } from './OverallCard'

const meta: ComponentMeta<typeof OverallCard> = {
  title: 'Components/OverallCard',
  component: OverallCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['OverallCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{height:100,width:300}}><Story/></div>)
  ]
}

export const OverallCardStoryProps: OverallCardProps = {
  followers: 0,
  resources: 23,
  years: 20
}

const OverallCardStory: ComponentStory<typeof OverallCard> = args => <OverallCard {...args} />

export const Default = OverallCardStory.bind({})
Default.args = OverallCardStoryProps

export default meta
