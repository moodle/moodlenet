import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { SearchboxProps } from './Searchbox.js'
import { Searchbox } from './Searchbox.js'

const meta: ComponentMeta<typeof Searchbox> = {
  title: 'Atoms/Searchbox',
  component: Searchbox,
  excludeStories: ['SearchboxStoryProps'],
  parameters: {
    layout: 'centered',
  },
}

export const SearchboxStoryProps: SearchboxProps = {
  placeholder: 'Start type to search',
  searchText: '',
  setSearchText: action('Search Text'),
  search: action('Search'),
}

const SearchboxStory: ComponentStory<typeof Searchbox> = args => <Searchbox {...args} />

export const Default: typeof SearchboxStory = SearchboxStory.bind({})
Default.args = SearchboxStoryProps

export default meta
