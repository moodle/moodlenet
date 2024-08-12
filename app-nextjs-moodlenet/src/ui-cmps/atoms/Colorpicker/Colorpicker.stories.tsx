'use client'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { ColorpickerProps } from './Colorpicker.jsx'
import Colorpicker from './Colorpicker.jsx'

const meta: ComponentMeta<typeof Colorpicker> = {
  title: 'Atoms/Colorpicker',
  component: Colorpicker,
  excludeStories: ['ColorpickerUnselected', 'ColorpickerSelected'],
  parameters: {
    layout: 'centered',
  },
}

const ColorpickerStory: ComponentStory<typeof Colorpicker> = args => (
  <Colorpicker {...args} style={{ color: 'blue' }} />
)

export const Default: ColorpickerProps = {}

export const Selected: typeof ColorpickerStory = ColorpickerStory.bind({})
Selected.args = Default

export default meta
