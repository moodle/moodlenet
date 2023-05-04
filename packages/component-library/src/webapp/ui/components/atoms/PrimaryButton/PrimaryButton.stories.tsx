// import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { PrimaryButton } from './PrimaryButton'

// const meta: ComponentMeta<typeof PrimaryButton> = {
//   title: 'Atoms/PrimaryButton',
//   component: PrimaryButton,
// }

// const PrimaryButtonStory: ComponentStory<typeof PrimaryButton> = () => <PrimaryButton>Primary Button</PrimaryButton>

// export const Default = PrimaryButtonStory.bind({})

// export default meta

import type { ComponentMeta, ComponentStory } from '@storybook/react'

// import { Button } from './Button'
import PrimaryButton from './PrimaryButton.js'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Atoms/PrimaryButton',
  component: PrimaryButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PrimaryButton>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrimaryButton> = args => (
  <PrimaryButton {...args}>Button</PrimaryButton>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  // primary: true,
  // label: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  // label: 'Button',
}

export const Large = Template.bind({})
Large.args = {
  // size: 'large',
  // label: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  // size: 'small',
  // label: 'Button',
}
