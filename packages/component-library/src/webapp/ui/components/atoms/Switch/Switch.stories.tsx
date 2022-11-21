import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Switch } from './Switch.js'

const meta: ComponentMeta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
}

const SwitchStory: ComponentStory<typeof Switch> = () => (
  <Switch
    enabled={false}
    toggleSwitch={() => {
      return
    }}
  />
)

export const Default = SwitchStory.bind({})

export default meta
