import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Activation, ActivationProps } from './Activation'

const meta: ComponentMeta<typeof Activation> = {
  title: 'Pages/SignUp',
  component: Activation,
  excludeStories: ['SignupStoryProps', 'ActivationStoryProps'],
}

const ActivationStory: ComponentStory<typeof Activation> = args => <Activation {...args} />

export const ActivationStoryProps: ActivationProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  onSubmit: action('Submit signup'),
  activationErrorMessage: null,
  accountActivated: true,
}

export const ActivationPage = ActivationStory.bind({})
ActivationPage.args = ActivationStoryProps
ActivationPage.parameters = { layout: 'fullscreen' }

export default meta
