import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FilterCard, FilterCardProps } from './FilterCard'
const meta: ComponentMeta<typeof FilterCard> = {
  title: 'Components/Cards/FilterCard',
  component: FilterCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FilterCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{width: 300}}><Story/></div>)
  ]
}


const FilterCardStory: ComponentStory<typeof FilterCard> = args => <FilterCard {...args} />

export const FilterCardStoryProps: FilterCardProps = {
  className: 'collection',
  title: 'Filters',
  content: [1,2,3].map((x)=>(
    <div>Filter {x}</div>
  ))
}

export const Default = FilterCardStory.bind({})
Default.args = FilterCardStoryProps

export default meta
