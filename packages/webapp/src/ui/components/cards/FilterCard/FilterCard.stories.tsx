import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox from '../../atoms/Checkbox/CheckInput'
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
  className: 'filter',
  title: 'Filters',
  content: [1,2,3].map((x)=>(
    <Checkbox label={`CheckBox ${x}`} />
  ))
}

export const Default = FilterCardStory.bind({})
Default.args = FilterCardStoryProps

export default meta
