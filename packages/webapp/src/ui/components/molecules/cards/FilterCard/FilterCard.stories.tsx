import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox from '../../../atoms/Checkbox/Checkbox'
import { FilterCard, FilterCardProps } from './FilterCard'

const meta: ComponentMeta<typeof FilterCard> = {
  title: 'Molecules/FilterCard',
  component: FilterCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FilterCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
}

const FilterCardStory: ComponentStory<typeof FilterCard> = (args) => (
  <FilterCard {...args} />
)

const content: [string, boolean][] = [
  ['Subjects', true],
  ['Collections', true],
  ['Resources', true],
  /*['Level', false], 
  ['Type', false], 
  ['Format', false], 
  ['License', false]*/
]

export const FilterCardStoryProps: FilterCardProps = {
  className: 'filter',
  title: 'Filters',
  content: content.map(([label, checked]) => (
    <Checkbox name={label} label={label} checked={checked} />
  )),
}

export const Default = FilterCardStory.bind({})
Default.args = FilterCardStoryProps

export default meta
