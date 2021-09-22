import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Activation, ActivationProps } from './Activation'

const meta: ComponentMeta<typeof Activation> = {
  title: 'Pages/Activation',
  component: Activation,
  excludeStories: ['SignupStoryProps', 'ActivationStoryProps'],
}

const ActivationStory: ComponentStory<typeof Activation> = args => <Activation {...args} />

export const ActivationStoryProps: ActivationProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  loginHref: href('Pages/Login/Default'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
  },
}

export const ActivationPage = ActivationStory.bind({})
ActivationPage.args = ActivationStoryProps
ActivationPage.parameters = { layout: 'fullscreen' }

export default meta
