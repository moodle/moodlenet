'use client'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useReducer } from 'react'
import { Switch } from './Switch'

const meta: ComponentMeta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
}

const SwitchStory: ComponentStory<typeof Switch> = () => {
  const [enabled, toggleSwitch] = useReducer(_ => !_, false)
  return <Switch enabled={enabled} toggleSwitch={toggleSwitch} />
}

export const Default: typeof SwitchStory = SwitchStory.bind({})

export default meta
