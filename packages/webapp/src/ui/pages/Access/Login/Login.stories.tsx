import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Login, LoginFormValues, LoginProps } from './Login'

const meta: ComponentMeta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  excludeStories: ['LoginStoryProps', 'LoginErrorStoryProps'],
  parameters: { layout: 'fullscreen' },
}

const LoginStory: ComponentStory<typeof Login> = args => <Login {...args} />

export const LoginStoryProps: LoginProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<LoginFormValues>({ email: '', password: '' }),
  wrongCreds: false,
  // landingHref: href('Pages/Landing/Logged In'),
  signupHref: href('Pages/SignUp/Sign Up'),
  recoverPasswordHref: href('Pages/Recover Password/Recover'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const LoginErrorStoryProps: LoginProps = {
  ...LoginStoryProps,
  wrongCreds: true,
}

export const Default = LoginStory.bind({})
Default.args = LoginStoryProps

export const Error = LoginStory.bind({})
Error.args = LoginErrorStoryProps

export default meta
