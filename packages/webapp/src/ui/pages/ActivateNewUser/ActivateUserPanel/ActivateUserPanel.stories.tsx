import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { ActivateNewUserPanel, ActivateNewUserPanelProps } from './ActivateUserPanel'

const meta: ComponentMeta<typeof ActivateNewUserPanel> = {
  title: 'Pages/ActivateNewUserPage/Components/ActivateUserPanel',
  component: ActivateNewUserPanel,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: /_.+/,
}

export const _activateNewUserPanelStoryProps: ActivateNewUserPanelProps = {
  mycss: 'red',
  message: null,
  submit: action('submitted form'),
  termsAndConditionsLink: href('Test/ActivateUserPanel'),
}

const ActivateUserPanelStory: ComponentStory<typeof ActivateNewUserPanel> = args => <ActivateNewUserPanel {...args} />

export const Default = ActivateUserPanelStory.bind({})
Default.args = _activateNewUserPanelStoryProps

export const ValuedWithMessage = ActivateUserPanelStory.bind({})
ValuedWithMessage.args = {
  ..._activateNewUserPanelStoryProps,
  message: 'Error message',
}

export default meta
