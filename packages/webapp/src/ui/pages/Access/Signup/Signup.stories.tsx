import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Signup, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/Signup',
  component: Signup,
  excludeStories: ['SignupStoryProps', 'EmailSendStoryProps'],
}

const SignupStory: ComponentStory<typeof Signup> = args => <Signup {...args} />

export const SignupStoryProps: SignupProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  onSubmit: action('Submit signup'),
  loginErrorMessage: null,
  requestSent: false
}

export const EmailSendStoryProps: SignupProps = {
  ...SignupStoryProps,
  requestSent: true
}

export const SignUpPage = SignupStory.bind({})
SignUpPage.args = SignupStoryProps
SignUpPage.parameters = { layout: 'fullscreen' }

export const EmailSent = SignupStory.bind({})
EmailSent.args = EmailSendStoryProps
EmailSent.parameters = { layout: 'fullscreen' }

export default meta
