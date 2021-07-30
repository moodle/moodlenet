import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { AccessHeaderStoryProps } from '../AccessHeader/AccessHeader.stories'
import { Login, LoginFormValues, LoginProps } from './Login'

const meta: ComponentMeta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  excludeStories: ['LoginStoryProps'],
}

const LoginStory: ComponentStory<typeof Login> = args => <Login {...args} />

export const LoginStoryProps: LoginProps = {
  accessHeaderProps: AccessHeaderStoryProps,
  formBag: SBFormikBag<LoginFormValues>({ email: '', password: '' }),
  loginErrorMessage: null,
  landingHref: href('yyy/yyy'),
  signupHref: href('yyy/yyy'),
}

export const LoginPage = LoginStory.bind({})
LoginPage.args = LoginStoryProps
LoginPage.parameters = { layout: 'fullscreen' }

export default meta
