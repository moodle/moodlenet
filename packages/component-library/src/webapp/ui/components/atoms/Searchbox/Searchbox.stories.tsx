import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Searchbox, SearchboxProps } from './Searchbox.js'

const meta: ComponentMeta<typeof Searchbox> = {
  title: 'Atoms/Searchbox',
  component: Searchbox,
  excludeStories: ['SearchboxStoryProps'],
}

export const SearchboxStoryProps: SearchboxProps = {
  placeholder: 'Start type to search',

  //   searchText: '',
  //   setSearchText: action('Search Text'),
}

const SearchboxStory: ComponentStory<typeof Searchbox> = args => <Searchbox {...args} />

export const Default = SearchboxStory.bind({})
Default.args = SearchboxStoryProps

export default meta
