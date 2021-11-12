import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { SBFormikBag } from '../../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Login, LoginFormValues, LoginProps } from './Login'

const meta: ComponentMeta<typeof Login> = {
  title: 'Pages/Access/Login',
  component: Login,
  excludeStories: ['LoginStoryProps', 'LoginErrorStoryProps'],
  parameters: { layout: 'fullscreen' },
}

const LoginStory: ComponentStory<typeof Login> = (args) => <Login {...args} />

export const LoginStoryProps: LoginProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<LoginFormValues>({ email: '', password: '' }),
  wrongCreds: false,
  // landingHref: href('Pages/Landing/Logged In'),
  signupHref: href('Pages/Access/SignUp/Default'),
  recoverPasswordHref: href('Pages/Recover Password/Recover'),
  mainPageWrapperProps: {
    userAcceptsPolicies: null,
    cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  },
}

export const LoginErrorStoryProps: LoginProps = {
  ...LoginStoryProps,
  wrongCreds: true,
  formBag: SBFormikBag<LoginFormValues>(
    { email: '', password: '' },
    {
      errors: {
        email: 'Please provide an email',
        password: 'Please provide a password',
      },
      submitCount: 1,
    }
  ),
}

export const Default = LoginStory.bind({})
Default.args = LoginStoryProps

export const Error = LoginStory.bind({})
Error.args = LoginErrorStoryProps

export default meta
