import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Activation, ActivationFormValues, ActivationProps } from './Activation'

const meta: ComponentMeta<typeof Activation> = {
  title: 'Pages/Activation',
  component: Activation,
  excludeStories: ['SignupStoryProps', 'ActivationStoryProps'],
}

const ActivationStory: ComponentStory<typeof Activation> = args => <Activation {...args} />

export const ActivationStoryProps: ActivationProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<ActivationFormValues>({
    name: '',
    password: '',
  }),
  activationErrorMessage: null,
  accountActivated: true,
}

export const ActivationPage = ActivationStory.bind({})
ActivationPage.args = ActivationStoryProps
ActivationPage.parameters = { layout: 'fullscreen' }

export default meta
