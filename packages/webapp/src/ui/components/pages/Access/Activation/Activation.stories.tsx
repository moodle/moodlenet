import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Activation, ActivationProps } from './Activation'

const meta: ComponentMeta<typeof Activation> = {
  title: 'Pages/Access/Activation',
  component: Activation,
  excludeStories: [
    'ActivationPage',
    'SignupStoryProps',
    'ActivationStoryProps',
  ],
}

const ActivationStory: ComponentStory<typeof Activation> = (args) => (
  <Activation {...args} />
)

export const ActivationStoryProps: ActivationProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  loginHref: href('Pages/Access/Login/Default'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const ActivationPage = ActivationStory.bind({})
ActivationPage.args = ActivationStoryProps
ActivationPage.parameters = { layout: 'fullscreen' }

export default meta
