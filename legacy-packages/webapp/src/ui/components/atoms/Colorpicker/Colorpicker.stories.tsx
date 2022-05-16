import { ComponentMeta, ComponentStory } from '@storybook/react'
import Colorpicker, { ColorpickerProps } from './Colorpicker'

const meta: ComponentMeta<typeof Colorpicker> = {
  title: 'Atoms/Colorpicker',
  component: Colorpicker,
  excludeStories: ['ColorpickerUnselected', 'ColorpickerSelected'],
}

const ColorpickerStory: ComponentStory<typeof Colorpicker> = (args) => (
  <Colorpicker {...args} />
)

export const ColorpickerDefault: ColorpickerProps = {}

export const Selected = ColorpickerStory.bind({})
Selected.args = ColorpickerDefault

export default meta
