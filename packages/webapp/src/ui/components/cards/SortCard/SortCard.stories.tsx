import { ComponentMeta, ComponentStory } from '@storybook/react'
import CheckButton from '../../atoms/CheckButton/CheckButton'
import { SortCard, SortCardProps } from './SortCard'

const meta: ComponentMeta<typeof SortCard> = {
  title: 'Components/Cards/SortCard',
  component: SortCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SortCardStoryProps'],
  decorators:[
    (Story)=>(<div style={{width: 200}}><Story/></div>)
  ]
}


const SortCardStory: ComponentStory<typeof SortCard> = args => <SortCard {...args} />

const content: [string, boolean][] = [
  ['Relevance', true], 
  ['Recent', true], 
  ['Popularity', true]
]


export const SortCardStoryProps: SortCardProps = {
  className: 'sort',
  title: 'Sort',
  content: content.map(([label])=>(
    <CheckButton label={label}/>
  ))
}

export const Default = SortCardStory.bind({})
Default.args = SortCardStoryProps

export default meta
