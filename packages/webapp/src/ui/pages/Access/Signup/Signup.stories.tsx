import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Signup, SignupFormValues, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/SignUp',
  component: Signup,
  excludeStories: ['SignupStoryProps', 'EmailSendStoryProps'],
}

const SignupStory: ComponentStory<typeof Signup> = args => <Signup {...args} />

export const SignupStoryProps: SignupProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<SignupFormValues>({ email: '' }),
  signupErrorMessage: null,
  requestSent: false,
  landingHref: href('yyy/yyy'),
  loginHref: href('yyy/yyy'),
}

export const EmailSendStoryProps: SignupProps = {
  ...SignupStoryProps,
  requestSent: true,
}

export const SignUpPage = SignupStory.bind({})
SignUpPage.args = SignupStoryProps
SignUpPage.parameters = { layout: 'fullscreen' }

export const EmailSent = SignupStory.bind({})
EmailSent.args = EmailSendStoryProps
EmailSent.parameters = { layout: 'fullscreen' }

export default meta
