import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { TrendCard, TrendCardProps } from './TrendCard'
const meta: ComponentMeta<typeof TrendCard> = {
  title: 'Components/Cards/TrendCard',
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
        type: "General",
        name: "#Agroforestry",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "General",
        name: "#Biology",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Desertification",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Rainforest",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Monitoring",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "General",
        name: "#Reforestation",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Brazilian Politics",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Reserves",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Indigenous People",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "General",
        name: "#Climate Change",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "General",
        name: "#Ecology",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "Specific",
        name: "Silviculture",
        subjectHomeHref: href('Pages/Category/Logged In')
    },
    {
        type: "General",
        name: "#Botanic",
        subjectHomeHref: href('Pages/Category/Logged In')
    }
  ]
}

export const Default = TrendCardStory.bind({})
Default.args = TrendCardStoryProps

export default meta
