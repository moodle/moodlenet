import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { Switch } from './Switch.js'

const meta: ComponentMeta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
}

const SwitchStory: ComponentStory<typeof Switch> = () => (
  <Switch
    enabled={false}
    toggleSwitch={() => {
      return
    }}
  />
)

export const Default: typeof SwitchStory = SwitchStory.bind({})

export default meta
