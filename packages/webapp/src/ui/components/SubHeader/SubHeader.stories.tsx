import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../elements/link'
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

const SubHeaderStory: ComponentStory<typeof SubHeader> = args => <SubHeader {...args} />

export const Default = SubHeaderStory.bind({})
Default.args = SubHeaderStoryProps
Default.parameters = {layout: 'fullscreen'}

export default meta
