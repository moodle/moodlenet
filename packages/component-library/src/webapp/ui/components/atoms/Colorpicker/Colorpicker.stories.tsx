import { ComponentMeta, ComponentStory } from '@storybook/react'
import Colorpicker, { ColorpickerProps } from './Colorpicker.js'

const meta: ComponentMeta<typeof Colorpicker> = {
  title: 'Atoms/Colorpicker',
  component: Colorpicker,
  excludeStories: ['ColorpickerUnselected', 'ColorpickerSelected'],
}

const ColorpickerStory: ComponentStory<typeof Colorpicker> = args => (
  <Colorpicker {...args} style={{ color: 'blue' }} />
)

export const Default: ColorpickerProps = {}

export const Selected = ColorpickerStory.bind({})
Selected.args = Default

export default meta
