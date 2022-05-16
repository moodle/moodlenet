import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SortCard, SortCardProps } from './SortCard'

const meta: ComponentMeta<typeof SortCard> = {
  title: 'Molecules/SortCard',
  component: SortCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['SortCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
}

const SortCardStory: ComponentStory<typeof SortCard> = (args) => (
  <SortCard {...args} />
)

const content: SortCardProps['content'] = [
  ['Relevance', 'Relevance', 'inactive'],
  ['Recent', 'Recent', 'more'],
  ['Popularity', 'Popularity', 'inactive'],
]

export const SortCardStoryProps: SortCardProps = {
  className: 'sort',
  title: 'Sort',
  content: content,
  onChange: action('set sort by'),
}

export const Default = SortCardStory.bind({})
Default.args = SortCardStoryProps

export default meta
