import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox from '../../atoms/Checkbox/CheckInput'
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

const content: [string, boolean][] = [['Subjects', true], ['Collections', true], ['Resources', true], ['Level', false], ['Type', false], ['Format', false], ['License', false]]


export const SortCardStoryProps: SortCardProps = {
  className: 'sort',
  title: 'Sort',
  content: content.map(([label, checked])=>(
    <Checkbox label={label} checked={checked}/>
  ))
}

export const Default = SortCardStory.bind({})
Default.args = SortCardStoryProps

export default meta
