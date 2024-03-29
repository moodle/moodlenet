import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { SearchImage } from './SearchImage.js'

const meta: ComponentMeta<typeof SearchImage> = {
  title: 'Atoms/SearchImage',
  component: SearchImage,
}

const SearchImageStory: ComponentStory<typeof SearchImage> = args => <SearchImage {...args} />

export const Default: typeof SearchImageStory = SearchImageStory.bind({})
Default.args = {
  onClose: action('close SearchImage'),
  // children: <h1>SearchImage Content</h1>,
}

export default meta
