import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { SBFormikBag } from '../../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Signup, SignupFormValues, SignupProps } from './Signup'

const meta: ComponentMeta<typeof Signup> = {
  title: 'Pages/SignUp',
  component: Signup,
  excludeStories: [
    'SignupStoryProps',
    'EmailSendStoryProps',
    'SignupErrorStoryProps',
  ],
}

const SignupStory: ComponentStory<typeof Signup> = (args) => (
  <Signup {...args} />
)

export const SignupStoryProps: SignupProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<SignupFormValues>(
    { name: '', email: '', password: '' },
    {
      submitForm: linkTo('', 'Email Sent'),
    }
  ),
  signupErrorMessage: null,
  requestSent: false,
  landingHref: href('Pages/Landing/Logged In'),
  loginHref: href('Pages/Login/Default'),
  userAgreementHref: href('Pages/Policies/UserAgreement/Default'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const SignupErrorStoryProps: SignupProps = {
  ...SignupStoryProps,
  signupErrorMessage: 'A beautiful error message',
  formBag: SBFormikBag<SignupFormValues>(
    { name: '', email: '', password: '' },
    {
      submitForm: linkTo('', 'Email Sent'),
      errors: {
        name: 'Please provide a display name',
        email: 'Please provide an email',
        password: 'Please provide a password',
      },
    }
  ),
}

export const EmailSendStoryProps: SignupProps = {
  ...SignupStoryProps,
  requestSent: true,
}

export const SignUp = SignupStory.bind({})
SignUp.args = SignupStoryProps
SignUp.parameters = { layout: 'fullscreen' }

export const SignUpError = SignupStory.bind({})
SignUpError.args = SignupErrorStoryProps
SignUpError.parameters = { layout: 'fullscreen' }

export const EmailSent = SignupStory.bind({})
EmailSent.args = EmailSendStoryProps
EmailSent.parameters = { layout: 'fullscreen' }

export default meta
