import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Signup, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/Signup',
  component: Signup,
  excludeStories: ['LoginStoryProps'],
}

const SignupStory: ComponentStory<typeof Signup> = args => <Signup {...args} />

export const LoginStoryProps: SignupProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  onSubmit: action('Submit signup'),
  loginErrorMessage: null,
}

export const SignupPage = SignupStory.bind({})
SignupPage.args = LoginStoryProps
SignupPage.parameters = { layout: 'fullscreen' }

export default meta
