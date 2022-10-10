import { jsx as _jsx } from 'react/jsx-runtime'
import { Searchbox } from './Searchbox.js'
const meta = {
  title: 'Atoms/Searchbox',
  component: Searchbox,
  excludeStories: ['SearchboxStoryProps'],
}
export const SearchboxStoryProps = {
  placeholder: 'Start type to search',
  //   searchText: '',
  //   setSearchText: action('Search Text'),
}
const SearchboxStory = args => _jsx(Searchbox, { ...args })
export const SearchboxDefault = SearchboxStory.bind({})
SearchboxDefault.args = SearchboxStoryProps
export default meta
//# sourceMappingURL=Searchbox.stories.js.map
